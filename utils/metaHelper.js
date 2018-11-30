import fileApi from '@/filters/fileApi'
import urlConfig from '@/config/urls'

/**
 * Get meta title from page data
 * with settings from config
 *
 * @param {object} page active page
 * @param {Map} config meta config
 * @param {String} locale active locale code
 *
 * @return {String} meta title
 */
const MetaHelper = {
  getMetaTitle: (page, config, locale) => {
    const localizedConfig = config.get(locale)

    // Meta Title
    let metaTitle = ''
    let metaTitlePrefix = ''
    let defaultMetaTitle = ''
    let siteName = 'WRPM Template'

    // get site name
    if (
      localizedConfig.has('site_name') &&
      localizedConfig.get('site_name').length > 0
    ) {
      siteName = localizedConfig.get('site_name')
    }

    // get prefix
    if (
      localizedConfig.has('meta_title_prefix') &&
      localizedConfig.get('meta_title_prefix').length > 0
    ) {
      metaTitlePrefix = localizedConfig.get('meta_title_prefix')
    }
    // get default meta title
    if (
      localizedConfig.has('default_meta_title') &&
      localizedConfig.get('default_meta_title').length > 0
    ) {
      defaultMetaTitle = localizedConfig.get('default_meta_title')
      if (metaTitlePrefix.length > 0) {
        defaultMetaTitle = metaTitlePrefix + ' - ' + defaultMetaTitle
      }
    } else {
      if (metaTitlePrefix.length > 0) {
        defaultMetaTitle = metaTitlePrefix
      }
    }
    // get meta title from field
    if (
      config.has('meta_title_key') &&
      config.get('meta_title_key').length > 0 &&
      config.get('meta_title_key') in page.fields &&
      _.isString(page.fields[config.get('meta_title_key')])
    ) {
      metaTitle = page.fields[config.get('meta_title_key')]
    }
    if (metaTitle.length > 0) {
      if (metaTitlePrefix.length > 0) {
        metaTitle = metaTitlePrefix + ' - ' + metaTitle
      }
    } else {
      if (defaultMetaTitle.length > 0) {
        metaTitle = defaultMetaTitle
      } else {
        metaTitle = defaultMetaTitle
      }
      metaTitle = siteName
    }

    return metaTitle
  },

  getMetaDescription: (page, config, locale) => {
    const localizedConfig = config.get(locale)

    // Meta Description
    let metaDescription = ''
    let defaultMetaDescription = ''

    // get default meta description
    if (
      localizedConfig.has('default_meta_description') &&
      localizedConfig.get('default_meta_description').length > 0
    ) {
      defaultMetaDescription = localizedConfig.get('default_meta_description')
    }

    // get meta description from field
    if (
      config.has('meta_description_key') &&
      config.get('meta_description_key').length > 0 &&
      config.get('meta_description_key') in page.fields &&
      _.isString(page.fields[config.get('meta_description_key')])
    ) {
      metaDescription = page.fields[config.get('meta_description_key')]
    }
    if (metaDescription.length == 0) {
      if (defaultMetaDescription.length > 0) {
        metaDescription = defaultMetaDescription
      }
    }

    return {
      name: 'description',
      hid: 'description',
      content: metaDescription
    }
  },

  getOGImage: (page, config) => {
    let ogImage = ''
    let defaultOgImage = ''
    let ogImageVersion = ''
    if (
      config.has('default_og_image') &&
      config.get('default_og_image').length > 0
    ) {
      defaultOgImage = config.get('default_og_image')
    }

    if (
      config.has('og_image_version') &&
      config.get('og_image_version').length > 0
    ) {
      ogImageVersion = config.get('og_image_version')
    }

    if (config.has('og_image_keys') && config.get('og_image_keys').length > 0) {
      for (const ogImageKey of config.get('og_image_keys')) {
        if (
          ogImageKey in page.fields &&
          _.isObject(page.fields[ogImageKey]) &&
          page.fields[ogImageKey] !== null
        ) {
          ogImage = page.fields[ogImageKey].url
        }
      }
    }

    if (ogImage.length == 0) {
      if (defaultOgImage.length > 0) {
        ogImage = defaultOgImage
      }
    } else {
      ogImage = fileApi(ogImage, ogImageVersion)
    }

    return {
      name: 'og:image',
      content: ogImage
    }
  },

  getOGTitle: (page, config, locale) => {
    return {
      name: 'og:title',
      content: MetaHelper.getMetaTitle(page, config, locale)
    }
  },

  getOGDescription: (page, config, locale) => {
    return {
      name: 'og:description',
      content: MetaHelper.getMetaDescription(page, config, locale).content
    }
  },

  getOGUrl: page => {
    let pageUrl = page.url.trim('/')
    if (pageUrl === urlConfig.get('home_url')) {
      pageUrl = ''
    }
    return {
      name: 'og:url',
      content: process.env.APP_URL.trim('/') + '/' + pageUrl
    }
  },

  getOGType: config => {
    return {
      name: 'og:type',
      content: config.get('default_og_type')
    }
  },

  getOGLocale: locale => {
    return {
      name: 'og:locale',
      content: locale
    }
  },

  getOGSiteName: (config, locale) => {
    return {
      name: 'og:site_name',
      content: config.get(locale).get('site_name')
    }
  },

  getTwitterTitle: (page, config, locale) => {
    return {
      name: 'twitter:title',
      content: MetaHelper.getMetaTitle(page, config, locale)
    }
  },

  getTwitterDescription: (page, config, locale) => {
    return {
      name: 'twitter:description',
      content: MetaHelper.getMetaDescription(page, config, locale).content
    }
  },

  getTwitterImage: (page, config) => {
    let twImage = ''
    let defaultTWImage = ''
    let twImageVersion = ''
    if (
      config.has('default_tw_image') &&
      config.get('default_tw_image').length > 0
    ) {
      defaultTWImage = config.get('default_tw_image')
    }

    if (
      config.has('tw_image_version') &&
      config.get('tw_image_version').length > 0
    ) {
      twImageVersion = config.get('tw_image_version')
    }

    if (config.has('tw_image_keys') && config.get('tw_image_keys').length > 0) {
      for (const twImageKey of config.get('tw_image_keys')) {
        if (
          twImageKey in page.fields &&
          _.isObject(page.fields[twImageKey]) &&
          page.fields[twImageKey] !== null
        ) {
          twImage = page.fields[twImageKey].url
        }
      }
    }

    if (twImage.length == 0) {
      if (defaultTWImage.length > 0) {
        twImage = defaultTWImage
      }
    } else {
      twImage = fileApi(twImage, twImageVersion)
    }

    return {
      name: 'twitter:image',
      content: twImage
    }
  },
  getTwitterUrl: page => {
    return {
      name: 'twitter:url',
      content: MetaHelper.getOGUrl(page).content
    }
  },
  getTwitterCard: config => {
    return {
      name: 'twitter:card',
      content: config.get('default_tw_card')
    }
  }
}

export default MetaHelper
