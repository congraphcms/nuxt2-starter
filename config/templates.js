
// odred of these definitions will influence the seniority of the rule
// if "template_keys" is defined before "template_set_map"
// "template_keys" will have priority to "template_set_map" setting
export default new Map([

  // keys for fields to be used for template
  ["template_keys", ["page_template"]],
  
  // map of templates to attribute sets
  ["template_set_map", new Map([
    ["page_home", "Home"],
    ["page_product", "Product"],
    ["page_modules", "Modules"],
    ["page_case_study_listing", "CaseStudies"],
    ["page_blog", "Blog"],
    ["page_contact", "Contact"],
    ["page_subcontact", "ContactForm"],
  ])],

  // map of templates to entity types
  ["template_type_map", new Map([
    ["module", "Module"],
    ["industry", "ModulesByIndustry"],
    ["case-study", "CaseStudy"],
    ["post", "BlogPost"],
  ])],

  // default template to use (in cases where specific page template couldn't be found)
  // leave empty or remove this setting if you don't want this behaviour
  ["default_template", ""],

  // which template to use for not found (404) case
  ["not_found_template", "NotFound"]

])