import { NextResponse } from 'next/server'

export const ok = (datos, status = 200) =>
  NextResponse.json({ ok: true, datos }, { status })

export const error = (mensaje, status = 400, detalles = null) =>
  NextResponse.json({ ok: false, mensaje, detalles }, { status })
