import React, { useState, useEffect, useCallback } from "react";
import { FieldInputProps } from "react-final-form";
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get";
import isEqual from "lodash/isEqual";
import { useDebouncedEffect, usePrevious } from "../../../hooks";

export type ApiWrapperProps<FieldValue = unknown> = {
  input?: FieldInputProps<FieldValue>;
  loadApiData?: (...args) => unknown;
  loadOneApiData?: (...arg) => unknown;
  // additional data so send to loadApiData
  apiPayload?: Record<string, unknown>;
  modelValues?: any;
  multipleSelection?: boolean;
  log?: boolean;
  resourceData?: any;
  apollo?: boolean;
  inputs?: Record<string, unknown>;
  loadInitialValue?: boolean;
  noMountApi?: boolean;
  selectSearchParameter?: string;
  noHttpHeader?: boolean;
  resourceData?: Record<string, unknown>;
  itemComponent?: React.FunctionComponent<any>;
};

export const ApiWrapper = (props: ApiWrapperProps) => {
  const {
    loadApiData,
    loadOneApiData,
    itemComponent: ItemComponent,
    modelValues,
    multipleSelection,
    log,
    input,
    loadInitialValue,
    selectSearchParameter = "search",
    noHttpHeader,
    apiPayload,
    apollo,
    noMountApi,
    inputs,
    resourceData,
    items: staticItems,
    prio,
    loaded,
    loadOneIdKey = "id",
    // content props
    lg,
  } = props;

  const [items, setItems] = useState<any>(staticItems);

  const [prioItems, setPrioItems] = useState<any>(prio);

  const [apiLoaded, setApiLoaded] = useState(false);
  const [valueLoaded, setValueLoaded] = useState(true);

  const prevInputs = usePrevious(inputs);

  /**  API RELATED */

  // handle dynamic inputs for resource api
  // dynamic inputs = $params.[FieldName]
  // useCase: get _id of resourceData needed as arg for the query
  const handleInputs = useCallback(() => {
    const newInputs = {};

    // dynamic input
    if (inputs && Object.keys(inputs)?.length > 0) {
      Object.keys(inputs).forEach((item) => {
        let inputValue = inputs[item];
        if (typeof inputValue === "string") {
          const params = inputValue.split("$params.");

          if (params?.length > 1) {
            const field = params[1];

            if (resourceData && resourceData[field])
              inputValue = resourceData[field];
          }
        }

        newInputs[item] = inputValue;
      });
    }

    return newInputs;
  }, [inputs, resourceData]);

  const createApolloApiConfig = useCallback(
    (apiConfig) => {
      const configData = {
        // keep the load one information
        loadOne: apiConfig.loadOne,
        // response values path in response
        responsePath: apiConfig.responsePath,
      };

      const headers = [];

      // no need to create the headers in that case
      if (!apiConfig.loadOne) {
        if (!modelValues) {
          console.warn(
            "[CustomSelect]: no model values provided for apollo config",
            apiConfig
          );
          return null;
        }
        for (
          let index = 0;
          index < Object.values(modelValues).length;
          index++
        ) {
          const element = Object.values(modelValues)[index];
          if (element.value && element.translatable) {
            headers.push({ key: `${element.value}.${lg}` });
          } else if (typeof element === "string") {
            headers.push({ key: element });
          }
        }
      }

      const resourceName = apiConfig?.resource || apiConfig?.resourceType;

      // contains options for both loadOne and loadMany
      configData.options = {
        // could include model
        ...apiConfig?.options,
        apollo: true,
        resourceList: resourceName,
        resourceOne:
          apiConfig?.resourceOne ||
          resourceName?.replace?.("GetMany", "GetOne") ||
          null,
        headers,
        noHttpHeader,
      };

      // for pagination & search in admin
      if (apiConfig.limit) configData.limit = apiConfig.limit;

      // Inputs if used by genericQuery (not for the admin)
      configData.inputs = handleInputs();

      // noInputData is used to not send the data directly in the inputs (when inputs is an object)
      if (apiConfig?.[selectSearchParameter] && !apiConfig.noInputData) {
        // Apply search to inputs
        if (typeof apiConfig.dataFunction === "function") {
          configData.inputs[selectSearchParameter] = apiConfig.dataFunction(
            apiConfig[selectSearchParameter]
          );
        } else {
          configData.inputs[selectSearchParameter] =
            apiConfig[selectSearchParameter];
        }
      }

      return configData;
    },
    [handleInputs, lg, modelValues, noHttpHeader, selectSearchParameter]
  );

  const loadDataNotLoaded = useCallback(
    (itemValue, list, apiConfig, callback?: (...args) => void) => {
      if (!loadOneApiData) return;

      // TODO: handle itemValue as object
      if (!itemValue || typeof itemValue === "object") return;

      const isLoaded =
        list.findIndex((e) => e[modelValues.value] === itemValue) !== -1;

      if (isLoaded) {
        // need to continue the list
        if (typeof callback === "function") callback(list);
        return;
      }

      setValueLoaded(false);

      // Avoid to be blocked if the request fail
      const timeoutID = setTimeout(() => {
        setValueLoaded(true);
      }, 5000);

      loadOneApiData({
        ...apiConfig,
        inputs: { [loadOneIdKey]: itemValue },
        callback: (newElem) => {
          clearTimeout(timeoutID);
          setValueLoaded(true);
          const clonedItems = cloneDeep(list);
          clonedItems.push(newElem);
          setItems(clonedItems);

          if (typeof callback === "function") callback(clonedItems);
        },
      });
    },
    [loadOneApiData, loadOneIdKey, modelValues]
  );

  const handleValuesNotLoaded = useCallback(
    (res, apiConfig, currentIndex = 0) => {
      // If loadOne mode => no need to do the loadData noLoaded
      // If loaded items => not need to load the missing data
      // loadInitialValue boolean needs to be true as well
      if (
        !input.value ||
        !loadOneApiData ||
        apiConfig.loadOne ||
        // Boolean to enable or not the handleValuesNotLoaded
        !loadInitialValue ||
        // Loaded is defined, is an array and has a length
        (Array.isArray(loaded) && loaded?.length) ||
        // Loaded is defined and is NOT an array
        (!Array.isArray(loaded) && loaded)
      )
        return;

      if (multipleSelection && input.value) {
        loadDataNotLoaded(
          input.value?.[currentIndex],
          res,
          apiConfig,
          (newRes) => {
            if (currentIndex < (input.value?.length || 0) - 1)
              handleValuesNotLoaded(newRes, apiConfig, currentIndex + 1);
          }
        );
      } else {
        loadDataNotLoaded(input.value, res, apiConfig);
      }
    },
    [
      loadDataNotLoaded,
      input,
      loadInitialValue,
      loadOneApiData,
      multipleSelection,
      loaded,
    ]
  );

  const getApiConfig = useCallback(
    (search) => {
      let apiConfig = search
        ? {
            ...apiPayload,
            ...search,
          }
        : apiPayload;

      if (apollo) {
        apiConfig = createApolloApiConfig(apiConfig);
      }

      return apiConfig;
    },
    [apiPayload, apollo, createApolloApiConfig]
  );

  const loadDataFromApi = useCallback(
    (search) => {
      // if callback is called on a unmounted view (when changing the current location for example), it will create an error in the console
      const apiConfig = getApiConfig(search);

      const loadData = apiConfig?.loadOne ? loadOneApiData : loadApiData;

      if (!loadData || !apiConfig) return;

      const apiData = {
        ...apiConfig,
        callback: (result) => {
          setApiLoaded(true);
          if (log) console.log("[Select response]", result);
          // allows to be compatible with pagination response or getOne with list inside of a model (static values)
          const results =
            get(result, apiConfig.responsePath || "items") || result;

          setItems(results);
          if (search) {
            // Put the items that have been searched in priority
            setPrioItems(
              (prio || []).concat(
                results?.map((it) => it?.[modelValues?.value])
              )
            );
          } else {
            // If search have been cleaned just put only in priority the prio props
            setPrioItems(prio || []);
          }
          // handleValuesNotLoaded(results, apiConfig);
        },
      };

      loadData(apiData);
    },
    [
      loadOneApiData,
      loadApiData,
      log,
      prio,
      setPrioItems,
      modelValues,
      getApiConfig,
    ]
  );

  /** END API RELATED */

  // TODO: should be able to watch loadDataFromApi
  useEffect(() => {
    if (!noMountApi) {
      loadDataFromApi();
    }
    // eslint-disable-next-line
  }, [apiPayload, noMountApi]);

  // inputs changed
  useDebouncedEffect(() => {
    // check that inputs content (and not memory address) has changed
    if (isEqual(prevInputs, inputs)) return;

    loadDataFromApi();
  }, [prevInputs, inputs]);

  useEffect(() => {
    setItems(staticItems);
  }, [staticItems]);

  // Call automatically handleValuesNotLoaded when items change
  useEffect(() => {
    if (items?.length && apiPayload) {
      handleValuesNotLoaded(items, getApiConfig());
    }
  }, [handleValuesNotLoaded, items, apiPayload, getApiConfig]);

  return (
    <ItemComponent
      {...props}
      apiPayload={apiPayload}
      valueLoaded={valueLoaded}
      apiLoaded={apiLoaded}
      items={items}
      loadDataFromApi={loadDataFromApi}
      prio={prioItems}
    />
  );
};

export default ApiWrapper;
