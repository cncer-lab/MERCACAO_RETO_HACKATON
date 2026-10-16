import { describe, it, expect } from 'vitest'
import { calcularMerma, calcularCostoUnitario, calcularMargen } from '../lib/calculos.js'

describe('calcularMerma', () => {
  it('100 -> 80: merma 20% y alerta', () => {
    const r = calcularMerma(100, 80)
    expect(r.ok).toBe(true)
    expect(r.merma).toBe(20)
    expect(r.alerta).toBe(true)
  })
  it('100 -> 90: merma 10% y sin alerta', () => {
    const r = calcularMerma(100, 90)
    expect(r.merma).toBe(10)
    expect(r.alerta).toBe(false)
  })
  it('rechaza entrada 0 o negativa', () => {
    expect(calcularMerma(0, 0).ok).toBe(false)
    expect(calcularMerma(-5, 1).ok).toBe(false)
  })
  it('salida mayor que entrada exige justificación', () => {
    expect(calcularMerma(100, 110).ok).toBe(false)
    expect(calcularMerma(100, 110, 'Se añadieron insumos').ok).toBe(true)
  })
})

describe('calcularCostoUnitario', () => {
  it('1.600.000 / 80 kg = 20.000', () => {
    expect(calcularCostoUnitario(1600000, 80).costoUnitario).toBe(20000)
  })
  it('salida 0 no divide y da mensaje', () => {
    const r = calcularCostoUnitario(1600000, 0)
    expect(r.ok).toBe(false)
    expect(r.mensaje).toContain('0 kg')
  })
})

describe('calcularMargen', () => {
  it('precio 25.000 y costo 20.000 = 20%', () => {
    expect(calcularMargen(25000, 20000).margen).toBe(20)
  })
  it('precio 0 no divide', () => {
    expect(calcularMargen(0, 100).ok).toBe(false)
  })
})
