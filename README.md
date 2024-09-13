# Enonic React Components

Library of React components for handling Enonic XP data.

## Install

```console
npm install --save @enonic/react-components
```

## RichText

Here is an example using the RichText component to render RichTextData in a React component named MyComponent.

Typically the RichTextData would be fetched from Enonic XP via the Guillotine GraphQL API.

```typescript
import type {
  ImageComponent,
  LinkComponent,
  MacroComponent,
  RichTextData
} from '@enonic/react-components';
import {RichText} from '@enonic/react-components';

interface RestProps {
  myCustomProp: string
}

const Image: ImageComponent = ({
  alt,
  sizes,
  src,
  srcSet,
  style,
}) => {
  return <img
    alt={alt}
    sizes={sizes}
    src={src}
    srcSet={srcSet}
    style={style}
  />;
}

const Link: LinkComponent = ({
  // children, // in aProps
    content: _content,
    media: _media,
    // href, // in aProps
    // target, // in aProps
    // title, // in aProps
    uri: _uri,
    ...aProps
}) => {
    return <a {...aProps} />;
}

const HelloWorldMacro = ({
  config,
  myCustomProp
}: {
  config: Record<string,any>
  myCustomProp: RestProps['myCustomProp']
}) => {
  return (
    <h1>Hello, World!</h1>
  );
}

const Macro: MacroComponent<RestProps> = ({
  config,
  descriptor,
  ...rest
}) => {
  if (descriptor === 'com.enonic.app.example:helloworld') {
    const props = {...rest, config};
    return <HelloWorldMacro {...props} />;
  }
  throw new Error(`Macro not found: ${descriptor}`);
}

export function MyComponent({data}: {data: RichTextData}) {
  return (
    <RichText<RestProps>
      className='someclass'
      data={data}
      Image={Image}
      Link={Link}
      Macro={Macro}
      tag='mytag'
      myCustomProp='lorum ipsum'
    />
  );
}
```

## Regions

The Regions, Region, Layout, Page and ComponentTag components, are typically used with [React4xp](https://market.enonic.com/starters/react4xp-starter).

Here is an example using the Regions component:

### Page controller

```typescript
import { getContent } from '/lib/xp/portal';
import { render } from '/lib/enonic/react4xp';

export function get(request) {
  const content = getContent();
  const react4xpId = `react4xp_${content._id}`;
  return render(
    entry,
    props: {
      regionsData: content.page.regions,
      names: "main",
      tag: "main",
    },
    request, {
      body: `<!DOCTYPE html><html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>${content.displayName}</title>
  </head>
  <body>
    <div id="${react4xpId}"></div>
  </body>
</html>`,
      id: react4xpId,
    }
  );
}
```

### React4XP Entry

```typescript
import React from 'react';
import { Regions } from '@enonic/react-components';

function Page (props) {
  return (
    <div>
      <Regions {...props} />
    </div>
  );
}

export default (props) => <Page {...props}/>;
```
