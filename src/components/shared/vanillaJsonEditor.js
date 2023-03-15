import { JSONEditor } from 'vanilla-jsoneditor';
import * as React from 'react';

export default function SvelteJSONEditor(props) {
  const refContainer = React.useRef(null);
  const refEditor = React.useRef(null);

  React.useEffect(() => {
    refEditor.current = new JSONEditor({
      target: refContainer.current,
      props: {}
    });

    return () => {
      // destroy editor
      if (refEditor.current) {
        console.log('destroy editor');
        refEditor.current.destroy();
        refEditor.current = null;
      }
    };
  }, []);

  // update props
  React.useEffect(() => {
    if (refEditor.current) {
      refEditor.current.updateProps(props);
    }
  }, [props]);

  return <div className="vanilla-jsoneditor-react" ref={refContainer}></div>;
}
