import { titles } from './titles'
import { Component, createSignal } from 'solid-js'

interface FormProps {
  onChangeTheme: (theme: string) => void
}

const Form: Component<FormProps> = (props: FormProps) => {
  const [email, setEmail] = createSignal('')
  const [title, setTitle] = createSignal('')
  const [website, setWebsite] = createSignal('')
  const [fullName, setFullName] = createSignal('')
  const [termsAccepted, setTermsAccepted] = createSignal(false)

  const onCancel = () => {
    // setCount(count() + 1);
  }

  const onSubmit = () => {
    // setCount(count() + 1);
  }

  return (
    <div class="bg-wht rounded-l shadow-hover p-ld-32 block">
      <ld-typo variant="h2" class="mb-ld-32">
        Hi there 👋
      </ld-typo>

      <ld-typo class="mb-ld-16">
        This small sandbox app demonstrates{' '}
        <a
          href="https://emdgroup-liquid.github.io/liquid/"
          class="font-bold hover:underline"
        >
          Liquid Oxygen
        </a>{' '}
        used in combination with Vue 3, Typescript, Tailwind CSS and Vite.
      </ld-typo>
      <ld-typo class="mb-ld-24">
        Let's change the theme of the app first:
      </ld-typo>

      <ld-label class="mb-ld-32 w-full">
        App Theme
        <ld-select
          onLdchange={(ev: Event) => {
            props.onChangeTheme((ev as CustomEvent).detail[0])
          }}
          placeholder="Pick a theme"
          prevent-deselection
        >
          <ld-option value="ocean" selected>
            Ocean
          </ld-option>
          <ld-option value="bubblegum">Bubblegum</ld-option>
          <ld-option value="shake">Shake</ld-option>
          <ld-option value="solvent">Solvent</ld-option>
          <ld-option value="tea">Tea</ld-option>
        </ld-select>
      </ld-label>

      <ld-typo class="mb-ld-24">
        Next we have set up some form validation:
      </ld-typo>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-ld-24 mb-ld-32">
        <ld-label>
          <span class="flex justify-between">
            Your title (optional)
            <ld-tooltip arrow position="top right" class="h-1">
              <ld-typo>
                We are asking because we'd like to address you correctly.
              </ld-typo>
            </ld-tooltip>
          </span>
          <ld-select
            placeholder="No title"
            onLdinput={(ev: Event) => {
              setTitle((ev as CustomEvent).detail[0])
            }}
          >
            {titles.map((title) => (
              <ld-option key={title} value={title}>
                {title}
              </ld-option>
            ))}
          </ld-select>
          <ld-input-message
            mode="valid"
            style={{
              visibility: title() ? 'inherit' : 'hidden',
            }}
          >
            Good pick.
          </ld-input-message>
        </ld-label>

        <ld-label>
          Your full name
          <ld-input
            placeholder="e.g. Jason Parse"
            tone="dark"
            value={fullName()}
            // invalid={this.v$.fullName.$error}
            onLdinput={(ev: Event) => {
              setFullName((ev.target as HTMLInputElement).value)
            }}
            // onBlur={(ev: Event) => {
            //   this.v$.fullName.$touch()
            // }}
          ></ld-input>
          {/*{this.v$.fullName.$error ? (*/}
          {/*  <ld-input-message mode="error">*/}
          {/*    {this.v$.fullName.$errors[0].$message}*/}
          {/*  </ld-input-message>*/}
          {/*) : (*/}
          {/*  <ld-input-message*/}
          {/*    mode="valid"*/}
          {/*    style={{*/}
          {/*      visibility: this.v$.fullName.$dirty ? 'inherit' : 'hidden',*/}
          {/*    }}*/}
          {/*  >*/}
          {/*    Lovely name.*/}
          {/*  </ld-input-message>*/}
          {/*)}*/}
        </ld-label>

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
          Your website (optional)
          <ld-input
            type="url"
            placeholder="e.g. https://example.com"
            tone="dark"
            value={website()}
            // invalid={this.v$.website.$error}
            onLdinput={(ev: Event) => {
              setWebsite((ev.target as HTMLInputElement).value)
            }}
            // onBlur={(ev: Event) => {
            //   this.v$.website.$touch()
            // }}
          ></ld-input>
          {/*{this.v$.website.$error ? (*/}
          {/*  <ld-input-message mode="error">*/}
          {/*    {this.v$.website.$errors[0].$message}*/}
          {/*  </ld-input-message>*/}
          {/*) : (*/}
          {/*  <ld-input-message*/}
          {/*    mode="valid"*/}
          {/*    style={{*/}
          {/*      visibility:*/}
          {/*        this.website && this.v$.website.$dirty ? 'inherit' : 'hidden',*/}
          {/*    }}*/}
          {/*  >*/}
          {/*    You even have a website! 👍*/}
          {/*  </ld-input-message>*/}
          {/*)}*/}
        </ld-label>
      </div>

      <ld-label class="w-full mb-ld-32">
        Comment (optional)
        <ld-input
          multiline
          placeholder="Be creative!"
          value=""
          tone="dark"
          style="min-height: 7rem"
        ></ld-input>
      </ld-label>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-ld-24 items-center">
        <ld-label position="right" size="m">
          <span
            classList={{
              'text-rr': !termsAccepted() /*&& this.v$.termsAccepted.$dirty,*/,
            }}
          >
            I accept the terms (none).
          </span>
          <ld-checkbox
            tone="dark"
            checked={termsAccepted()}
            onLdinput={() => {
              setTermsAccepted(!termsAccepted())
            }}
            // onBlur={(ev: Event) => {
            //   this.v$.termsAccepted.$touch()
            // }}
            // invalid={this.v$.termsAccepted.$error}
          ></ld-checkbox>
        </ld-label>

        <div class="grid grid-cols-2 gap-ld-16">
          <ld-button onClick={onCancel} mode="secondary">
            Cancel
          </ld-button>
          <ld-button onClick={onSubmit}>Submit</ld-button>
        </div>
      </div>
    </div>
  )
}

export default Form
