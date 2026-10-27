# Enonic React Components

Library of React components for handling Enonic XP data.

## Install

```console
npm install --save @enonic/react-components
```

## ComponentRegistry

The `ComponentRegistry` is used to register View components for parts, layouts, pages, macros, and content types. Registered components are then resolved and rendered by the corresponding `Base*` components.

```typescript
import {ComponentRegistry} from '@enonic/react-components';

const componentRegistry = new ComponentRegistry();

componentRegistry.addPart('com.enonic.app.myapp:mypart', {
  View: MyPartView
});

componentRegistry.addLayout('com.enonic.app.myapp:mylayout', {
  View: MyLayoutView
});

componentRegistry.addPage('com.enonic.app.myapp:mypage', {
  View: MyPageView
});

componentRegistry.addMacro('mymacro', {
  View: MyMacroView
});

componentRegistry.addContentType('com.enonic.app.myapp:mycontenttype', {
  View: MyContentTypeView
});
```

Registered components receive `ComponentProps`:

```typescript
import type {ComponentProps} from '@enonic/react-components';

function MyPartView({component, data, common, meta}: ComponentProps) {
  return <div>{/* render part */}</div>;
}
```

## Base Components

The `BaseComponent` resolves the component type and delegates rendering to the appropriate base component (`BasePart`, `BaseLayout`, `BasePage`, `BaseText`, `BaseContentType`). Each base component looks up the registered View in the `ComponentRegistry` using the component descriptor.

```typescript
import {BaseComponent} from '@enonic/react-components';

<BaseComponent component={component} data={data} meta={meta} common={common} />
```

The `meta` prop carries context including the `componentRegistry` and request `mode`:

```typescript
import type {MetaData} from '@enonic/react-components';

const meta: MetaData = {
  type: 'portal:site',
  id: 'content-id',
  path: '/mysite',
  mode: 'live',
  componentRegistry,
};
```

## Regions

The `Regions` and `Region` components render Enonic XP regions containing page components.

```typescript
import {Regions} from '@enonic/react-components';

function MyPageView({component, data, common, meta}: ComponentProps) {
  return (
    <div>
      <Regions component={component} meta={meta} common={common} />
    </div>
  );
}
```

`Region` can also be used directly for more control:

```typescript
import {Region} from '@enonic/react-components';

<Region
  name="main"
  data={regionComponents}
  meta={meta}
  as="main"
  className="my-region"
/>
```

## RichText

The `RichText` component renders processed HTML from Enonic XP, with support for custom Image, Link, and Macro replacers.

```typescript
import type {RichTextData, RichTextMetaData, PartData} from '@enonic/react-components';
import {RichText} from '@enonic/react-components';

const meta: RichTextMetaData = {
  type: 'portal:site',
  id: 'content-id',
  path: '/mysite',
  mode: 'live',
};

const component: PartData = {
  descriptor: 'com.enonic.app.myapp:mypart',
  path: '/main/0',
  type: 'part',
};

const data: RichTextData = {
  processedHtml: '<p>Hello World</p>',
  macros: [],
  images: [],
  links: [],
};

<RichText data={data} meta={meta} component={component} />
```

### Custom tag and className

```typescript
<RichText
  data={data}
  meta={meta}
  component={component}
  tag="article"
  className="rich-text"
/>
```

### Custom Image, Link, and Macro components

You can override the default Image, Link, and Macro components. Extra props are forwarded to the custom components via the generic `RestProps` type parameter.

```typescript
import type {
  ImageComponent,
  LinkComponent,
  MacroComponent,
} from '@enonic/react-components';
import {RichText} from '@enonic/react-components';

const MyImage: ImageComponent = ({alt, src, srcSet, sizes, style}) => {
  return <img alt={alt} src={src} srcSet={srcSet} sizes={sizes} style={style} />;
};

const MyLink: LinkComponent = ({href, target, title, children}) => {
  return <a href={href} target={target} title={title}>{children}</a>;
};
// Link is called for every <a> with an href. Referenced links have `data`,
// including `data.content`, `data.media` and `data.uri`.
// Ordinary HTML links (https, mailto, anchors) have `data: undefined`.

interface RestProps {
  myCustomProp: string;
}

const MyMacro: MacroComponent<RestProps> = ({component, meta, children, myCustomProp}) => {
  return <div>{children}</div>;
};

<RichText<RestProps>
  data={data}
  meta={meta}
  component={component}
  Image={MyImage}
  Link={MyLink}
  Macro={MyMacro}
  myCustomProp="value"
/>
```

Like macros, custom image and link components receive their payload through `data`.
For images, this is the original `ImageData` entry; for referenced links, it is the original `LinkData` entry.
Ordinary HTML links have `data: undefined`.
These entries can carry URL strings or `UrlParts` objects (`path`, optional `queryString` and `baseUrl`),
responsive image candidates, and link fragments.
The library forwards these values unchanged: custom components decide how to resolve them for their application.
The existing `href`, `src` and `srcSet` props still come from the HTML, and the default components continue to render those HTML attributes.

The existing top-level reference props remain available as deprecated aliases:

| Deprecated prop | Preferred replacement |
| --- | --- |
| Image `image` | `data.image` |
| Image `imageStyle` | `data.style` |
| Link `content` | `data.content` |
| Link `media` | `data.media` |
| Link `uri` | `data.uri` for referenced links; `href` for ordinary HTML links |

The aliases preserve the original values; an ordinary HTML link still receives `uri: href`.
Both APIs are supplied together, so existing renderers can migrate incrementally.
Reference content may be null for unresolved entries; custom renderers must handle that case.
The top-level image `style` prop remains the element's CSS, not the image-processing metadata in `data.style`.
When spreading props onto an HTML element, exclude both `data` and the deprecated reference props.
The default components already do this.

### Custom replacer

For full control over how DOM nodes are replaced, provide a `replacer` function:

```typescript
import type {Replacer} from '@enonic/react-components';

const myReplacer: Replacer = ({el, data, component, meta}) => {
  if (el.attribs?.['class'] === 'custom') {
    return <div className="replaced" />;
  }
};

<RichText data={data} meta={meta} component={component} replacer={myReplacer} />
```
