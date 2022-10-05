import type { Component } from 'solid-js'
import { createSignal } from 'solid-js'

const Login: Component = () => {
  const [email, setEmail] = createSignal('')
  const [password, setPassword] = createSignal('')

  return (
    <div>
      <ld-typo
        variant="b2"
        tag="h1"
        class="text-vy mb-ld-40"
        aria-label="Uxer Experience, Stragegy and Design To-Do"
      >
        Login
      </ld-typo>

      <div class="bg-wht rounded-l shadow-hover p-ld-32 flex flex-col align-center justify-items-center">
        <div class="grid grid-cols-1 md:grid-cols-1 gap-ld-24">
          <ld-label>
            Your email address
            <ld-input
              type="email"
              placeholder="e.g. jason.parse@example.com"
              tone="dark"
              value={email()}
              // invalid={this.v$.email.$error}
              onLdinput={(ev: Event) => {
                setEmail((ev.target as HTMLInputElement).value)
              }}
              // onBlur={(ev: Event) => {
              //   this.v$.email.$touch()
              // }}
            ></ld-input>
            {/*{this.v$.email.$error ? (*/}
            {/*  <ld-input-message mode="error">*/}
            {/*    {this.v$.email.$errors[0].$message}*/}
            {/*  </ld-input-message>*/}
            {/*) : (*/}
            {/*  <ld-input-message*/}
            {/*    mode="valid"*/}
            {/*    style={{*/}
            {/*      visibility: this.v$.email.$dirty ? 'inherit' : 'hidden',*/}
            {/*    }}*/}
            {/*  >*/}
            {/*    Lovely email address.*/}
            {/*  </ld-input-message>*/}
            {/*)}*/}
          </ld-label>

          <ld-label>
            Your password
            <ld-input
              type="password"
              placeholder="••••••••••"
              tone="dark"
              value={password()}
              // invalid={this.v$.password.$error}
              onLdinput={(ev: Event) => {
                setPassword((ev.target as HTMLInputElement).value)
              }}
              // onBlur={(ev: Event) => {
              //   this.v$.password.$touch()
              // }}
            ></ld-input>
            {/*{this.v$.password.$error ? (*/}
            {/*  <ld-input-message mode="error">*/}
            {/*    {this.v$.password.$errors[0].$message}*/}
            {/*  </ld-input-message>*/}
            {/*) : (*/}
            {/*  <ld-input-message*/}
            {/*    mode="valid"*/}
            {/*    style={{*/}
            {/*      visibility: this.v$.password.$dirty ? 'inherit' : 'hidden',*/}
            {/*    }}*/}
            {/*  >*/}
            {/*    Lovely password address.*/}
            {/*  </ld-input-message>*/}
            {/*)}*/}
          </ld-label>

          <ld-button href="/login" mode="highlight">
            <span class="px-8">Login</span>
          </ld-button>

          <ld-typo>
            Don't have an account yet?&ensp;
            <ld-link href="/signup">Sign up here.</ld-link>
          </ld-typo>
        </div>
      </div>
    </div>
  )
}

export default Login
