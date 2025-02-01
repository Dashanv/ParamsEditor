import React, { useState, useImperativeHandle, forwardRef } from "react";


interface Param {
  id: number;
  name: string;
  type: "string";
}

interface ParamValue {
  paramId: number;
  value: string;
}

interface Model {
  paramValues: ParamValue[];
  colors: any[]; 
}

interface Props {
  params: Param[];
  model: Model;
}

interface ParamEditorRef {
  getModel: () => Model;
}

const ParamEditor = forwardRef<ParamEditorRef, Props>(({ params, model }, ref) => {
  const [paramValues, setParamValues] = useState<ParamValue[]>(
    model.paramValues || []
  );


  const handleInputChange = (paramId: number, value: string) => {
    setParamValues((prevValues) => {
      const updatedValues = prevValues.map((paramValue) =>
        paramValue.paramId === paramId
          ? { ...paramValue, value }
          : paramValue
      );

  
      if (!updatedValues.find((pv) => pv.paramId === paramId)) {
        updatedValues.push({ paramId, value });
      }

      return updatedValues;
    });
  };

  
  useImperativeHandle(ref, () => ({
    getModel: () => ({
      paramValues,
      colors: model.colors,
    }),
  }));

  return (
    <div>
      {params.map((param) => {
        const currentValue = paramValues.find(
          (pv) => pv.paramId === param.id
        )?.value || "";

        return (
          <div key={param.id} style={{ marginBottom: "10px" }}>
            <label>
              {param.name}
              <input
                type="text"
                value={currentValue}
                onChange={(e) =>
                  handleInputChange(param.id, e.target.value)
                }
                style={{ marginLeft: "10px" }}
              />
            </label>
          </div>
        );
      })}
    </div>
  );
});


const params: Param[] = [
  { id: 1, name: "Назначение", type: "string" },
  { id: 2, name: "Длина", type: "string" },
];

const model: Model = {
  paramValues: [
    { paramId: 1, value: "повседневное" },
    { paramId: 2, value: "макси" },
  ],
  colors: [],
};

const App = () => {
  const editorRef = React.useRef<ParamEditorRef>(null);

  const handleGetModel = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getModel());
    }
  };

  return (
    <div>
      <h1>Редактор параметров</h1>
      <ParamEditor ref={editorRef} params={params} model={model} />
      <button onClick={handleGetModel} style={{ marginTop: "20px" }}>
        Получить модель
      </button>
    </div>
  );
};

export default App;