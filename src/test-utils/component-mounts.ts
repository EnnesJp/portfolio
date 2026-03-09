import { mount } from '@vue/test-utils'
import type { Component } from 'vue'
import { setupStoreMocks } from './store-mocks'

export function mountWithDependencies(
  component: Component,
  options: {
    props?: Record<string, any>
    global?: Record<string, any>
    storeMocks?: ReturnType<typeof setupStoreMocks>
  } = {},
) {
  const { props = {}, global = {}, storeMocks } = options
  const mocks = storeMocks || setupStoreMocks()

  return {
    wrapper: mount(component, {
      props,
      global: {
        plugins: [mocks.pinia],
        stubs: {
          Teleport: true,
        },
        ...global,
      },
    }),
    mocks,
  }
}

export function simulateScroll(scrollY: number) {
  Object.defineProperty(window, 'scrollY', {
    writable: true,
    configurable: true,
    value: scrollY,
  })

  window.dispatchEvent(new Event('scroll'))
}
