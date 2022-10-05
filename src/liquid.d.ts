import { JSX as SolidJSX } from 'solid-js'
import { JSX as LocalJSX } from '@emdgroup-liquid/liquid'

type LiquidElements<T> = {
  [P in keyof T]?: T[P] & SolidJSX.HTMLAttributes<never>
}

declare module 'solid-js' {
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface IntrinsicElements
      extends LiquidElements<LocalJSX.IntrinsicElements> {}
  }
}
