import { FlatCompat } from '@eslint/eslintrc'
import baseConfig from './eslint-base.js'

const compat = new FlatCompat()

export default [
  ...baseConfig,
  ...compat.extends('next/core-web-vitals'),
]
