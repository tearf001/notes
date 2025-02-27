```tsx
import { createSignal } from "solid-js";
import { render } from "solid-js/dom";

function ComponentA(props) {
  return <>A {props.children}</>;
}
function ComponentB(props) {
  return <>B {props.children}</>;
}
const App = () => {
  const [selectedComponent, setSelectedComponent] = createSignal(ComponentB);
  return (
    <>
      <div>
        <Dynamic component={selectedComponent()}>
          {
            <button
              onClick={() =>
                setSelectedComponent(
                  selectedComponent() === ComponentA ? ComponentB : ComponentA
                )
              }
            >
              {Math.random()}
            </button>
          }
        </Dynamic>
        rest of div
      </div>
    </>
  );
};

render(App, document.body);

```