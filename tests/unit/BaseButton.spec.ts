import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '@/components/ui/BaseButton.vue'

describe('BaseButton', () => {
  it('se deshabilita mientras carga', () => {
    const wrapper = mount(BaseButton, { props: { loading: true }, slots: { default: 'Guardar' } })
    const button = wrapper.get('button')
    expect(button.attributes('disabled')).toBeDefined()
    expect(button.attributes('aria-busy')).toBe('true')
    expect(button.text()).toBe('Guardar')
  })
})
