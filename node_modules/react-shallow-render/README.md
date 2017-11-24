# react-shallow-render
Convenience function for React Shallow Rendering

```js
import assert from 'assert';
import React from 'react';
import shallowRender from 'react-shallow-render';

const rendered = shallowRender(<div className="test" />);
assert.equal(rendered.type, 'div');
assert.equal(rendered.props.className, 'test');
```
