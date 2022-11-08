import { type Component, onCleanup, onMount } from 'solid-js'

const Aside: Component = () => {
  let cookieConsentRef: HTMLLdCookieConsentElement

  const settings = {
    categories: [
      {
        title: 'Necessary',
        details: {
          description:
            'These cookies are necessary for the website to operate. Our website cannot function without these cookies, and they can only be disabled by changing your browser preferences.',
        },
        toggle: {
          value: 'necessary',
          checked: true,
          disabled: true,
        },
      },
      {
        title: 'Functional',
        details: {
          description:
            'These cookies enable the provision of advanced functionalities and are used for personalization. The cookies are set in particular in response to your actions and depend on your specific service requests (e.g., pop-up notification choices).',
        },
        toggle: {
          value: 'functional',
          checked: true,
        },
      },
      {
        title: 'Targeting',
        details: {
          description:
            'These cookies may be set to learn more about your interests and show you relevant ads on other websites. These cookies work by uniquely identifying your browser and device. By integrating these cookies, we aim to learn more about your interests and your surfing behavior and to be able to place our advertising in a targeted manner.',
          cookieTable: {
            headers: ['Name', 'Provider', 'Description', 'Lifespan'],
            rows: [
              [
                '_ga',
                'Google LLC',
                'Used to distinguish unique users...',
                '2 years',
              ],
              [
                '_gat',
                'Google LLC',
                'Used to throttle the request rate...',
                '1 minute',
              ],
            ],
          },
        },
        toggle: {
          value: 'targeting',
          checked: true,
        },
        autoclear: [
          {
            name: '_ga',
            domain: 'example.com',
            path: '/',
          },
          {
            name: '_gat',
            domain: 'example.com',
            path: '/',
          },
        ],
      },
    ],
    privacyStatementURL: '/privacy',
  }

  const setFocus = () => {
    document
      .querySelector<HTMLLdButtonElement>('#update-cookie-settings-button')
      ?.focusInner()
  }

  onMount(async () => {
    cookieConsentRef.addEventListener('ldCookieConsentSave', setFocus, {
      passive: true,
    })
  })

  onCleanup(() => {
    cookieConsentRef.removeEventListener('ldCookieConsentSave', setFocus)
  })

  return (
    <ld-cookie-consent
      ref={(el: HTMLLdCookieConsentElement) => (cookieConsentRef = el)}
      settings={settings}
    />
  )
}

export default Aside
