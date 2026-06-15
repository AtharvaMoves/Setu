import { setuConfig } from "../config/setu";

export const SITE_NAME = setuConfig.site.name;
export const SITE_DESCRIPTION = setuConfig.site.description;
export const SITE_URL = setuConfig.site.url;
export const MAIN_SITE_URL = setuConfig.site.mainSiteUrl;
export const DOCS_URL = setuConfig.routes.docs;
export const ABOUT_URL = setuConfig.routes.about;
export const AI_INDEX_URL = setuConfig.routes.aiIndex;
export const REPO_URL = setuConfig.site.repository.url;
export const REPO_SLUG = setuConfig.site.repository.slug;
export const REPO_API_URL = `https://api.github.com/repos/${REPO_SLUG}`;
