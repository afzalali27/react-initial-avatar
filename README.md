# React Initials Avatar

Create sleek avatars with initials using the lightweight 'react-initial-avatar' component for your React applications

## Installation

```bash
npm install react-initial-avatar
```

## Usage

```jsx
import React from 'react';
import Avatar from 'react-initial-avatar';

const App = () => {
  return (
    <div>
      <Avatar name="John Doe" />
    </div>
  );
};

export default App;
```

## Props

| Prop            | Type   | Default   | Description                                           |
| --------------- | ------ | --------- | ----------------------------------------------------- |
| name            | string |           | The name to extract initials from.                    |
| height          | number | `30px`    | The height of the initials container.                 |
| width           | number | `30px`    | The width of the initials container.                  |
| backgroundColor | string | `#f0f8ff` | The background color of the initials container.       |
| color           | string | `#6495ed` | The text color (initials color) inside the container. |
| borderRadius    | number | `none`    | The border radius of the initials container.          |
| borderWidth     | number | `none`    | The border width of the initials container.           |
| borderColor     | string | `none`    | The border color of the initials container.           |
| style           | object | `{}`      | (optional) custom style object.                       |
| splitWith       | string | `" "`     | delimeter to split name with                          |

## Examples

```jsx
import React from 'react';
import Avatar from 'react-initial-avatar';

const Example = () => {
  return (
    <div>
      <Avatar name="Afzal Ali" />
      <Avatar color="red" backgroundColor="#FFF" name="Elizabeth Smith Brown" />
      <Avatar borderRadius={50} borderWidth={1} borderColor="black" name="Jane Smith" />
    </div>
  );
};
export default Example;
```

## License

MIT © [afzalali27](https://github.com/afzalali27)
