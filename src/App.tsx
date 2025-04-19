import "./app.scss";
import { ButtonC } from "./components/ButtonC";
import { InputFocusBlur } from "./components/InputFocusBlur";
import "./utils/index";

function App() {
  return (
    <>
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="flex flex-col gap-4 items-center ">
          <InputFocusBlur placeholder="Name" size={32} />
          <div className="flex flex-col gap-2 w-42">
            <ButtonC name="Create match" />
            <ButtonC name="Join match" />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
