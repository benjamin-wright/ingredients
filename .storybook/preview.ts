import { type Preview, setup } from '@storybook/vue3'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { setupFA } from '../src/font-awesome';

setup(setupFA);

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  }
}

export default preview
