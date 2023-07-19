export interface ContentProps {
  lg?: string;
  defaultLanguage?: string;
  content?: any;
  localeContent?: any;
}

export interface SocialProps {
  loginSocial: (...args: any[]) => any;
  registerSocial: (...args: any[]) => any;
}
