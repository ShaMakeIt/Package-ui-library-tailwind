import { CustomDropdown } from "../components/enhancers/CustomDropdown/CustomDropdown";
import Dropdown from "../components/structure/dropdown/Dropdown";
import FieldWrapper from "../components/structure/fieldWrapper/FieldWrapper";

function Home() {
  return (
    <>
      <div className="text-primary">Home</div>
      <Dropdown label="hello" />
      <FieldWrapper />
    </>
  );
}

export default Home;
