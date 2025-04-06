import React, { useState } from 'react'
import './App.css'

interface Param {
  id: number
  name: string
  type: 'string'
}

interface ParamValue {
  paramId: number
  value: string
}

interface Model {
  paramValues: ParamValue[]
  colors: string[]
}

interface Props {
  params: Param[]
  model: Model
  onModelChange: (model: Model) => void
}

class ParamEditor extends React.Component<Props, { values: Map<number, string>; color: string }> {
  constructor(props: Props) {
    super(props)
    this.state = {
      values: new Map(props.model.paramValues.map((item) => [item.paramId, item.value])),
      color: props.model.colors.length > 0 ? props.model.colors[0] : '#000000',
    }
  }

  public getModel(): Model {
    const { values, color } = this.state
    return {
      paramValues: Array.from(values).map(([paramId, value]) => ({ paramId, value })),
      colors: [color],
    }
  }

  handleChange = (paramId: number, newValue: string): void => {
    this.setState((prevState) => {
      const updatedValues = new Map(prevState.values).set(paramId, newValue)
      this.updateModel(updatedValues)
      return { values: updatedValues }
    })
  }

  handleColorChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ color: e.target.value }, this.updateModel)
  }

  updateModel = (updatedValues?: Map<number, string>) => {
    const { color } = this.state
    const { onModelChange } = this.props

    const updatedModel: Model = {
      paramValues: Array.from(updatedValues || this.state.values).map(([paramId, value]) => ({ paramId, value })),
      colors: [color],
    }

    onModelChange(updatedModel)
  }

  render() {
    const { params } = this.props
    const { values, color } = this.state

    return (
      <div className='wrapper'>
        {params.map((param) => (
          <div className='paramContainer' key={param.id}>
            <label className='paramNames'>{param.name}</label>
            <input
            className='paramInput'
              type="text"
              value={values.get(param.id) || ''}
              onChange={(e) => this.handleChange(param.id, e.target.value)}
            />
          </div>
        ))}

        <div className='paramContainer'>
          <label>Цвет</label>
          <input
            type="color"
            value={color}
            onChange={this.handleColorChange}
          />
        </div>
      </div>
    )
  }
}

const App = () => {
  const [jsonModel, setJsonModel] = useState<string>('')

  const params: Param[] = [
    { id: 1, name: 'Назначение', type: 'string' },
    { id: 2, name: 'Длина', type: 'string' },
    { id: 3, name: 'Стиль', type: 'string' },
  ]

  const initialModel: Model = {
    paramValues: [
      { paramId: 1, value: 'повседневное' },
      { paramId: 2, value: 'макси' },
      { paramId: 3, value: 'свободный' },
    ],
    colors: [],
  }

  const [model, setModel] = useState<Model>(initialModel)
  const editorRef = React.useRef<ParamEditor>(null);

  const handleGetModel = () => {
    if (editorRef.current) {
      setJsonModel(JSON.stringify(editorRef.current.getModel(), null, 2));
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Редактор параметров модели</h1>
      <div className="param-editor">
        <ParamEditor
        ref={editorRef}
        params={params}
        model={model}
        onModelChange={setModel}
        />
      </div>
      <button onClick={handleGetModel} style={{ marginTop: '20px' }}>
        Получить модель
      </button>

      {jsonModel && (
        <div style={{ marginTop: '20px', whiteSpace: 'pre-wrap' }}>
          <h3>Результат модели:</h3>
          <pre>{jsonModel}</pre>
        </div>
      )}
    </div>
  )
}

export default App