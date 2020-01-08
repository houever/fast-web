import defaultSettings from '@/settings'

const title = defaultSettings.title || 'M-admin'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
