import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import useStore from './store'; // Import your Zustand store

const App = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [formula, setFormula] = useState('');
  const [total, setTotal] = useState(0);
  const [savedFormulas, setSavedFormulas] = useState([]);
  const { data: fetchedData } = useQuery('data', async () => {
    const response = await fetch('https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  });

  const saveFormula = useStore(state => state.saveFormula);
  const formulas = useStore(state => state.formulas);

  useEffect(() => {
    setSavedFormulas(formulas);
  }, [formulas]);

  useEffect(() => {
    if (formula) {
        // Split the formula into parts while preserving spaces
        const formulaParts = formula.match(/(?:[^\s']+|'[^']*')+/g);

        let result = 0;
        let currentOperator = '+';

        for (let i = 0; i < formulaParts.length; i++) {
            const part = formulaParts[i].trim();
            if (part === '+' || part === '-' || part === '*' || part === '/' || part === '^') {
                // Update current operator
                currentOperator = part;
            } else {
                // Parse the part as a number
                const value = parseFloat(part);
                switch (currentOperator) {
                    case '+':
                        result += value;
                        break;
                    case '-':
                        result -= value;
                        break;
                    case '*':
                        result *= value;
                        break;
                    case '/':
                        result /= value;
                        break;
                    case '^':
                        result = Math.pow(result, value);
                        break;
                    default:
                        break;
                }
            }
        }

        setTotal(result);
    }
}, [formula]);




const handleItemSelect = (item) => {
  setSelectedItems([...selectedItems, item]);
  setFormula((prevFormula) => prevFormula ? `${prevFormula} + ${item.value}` : item.value.toString());
};


  const handleOperandInputChange = (e) => {
    setFormula(e.target.value);
  };

  const handleSaveFormula = () => {
    saveFormula(formula);
    // Clear the formula and selected items
    setFormula('');
    setSelectedItems([]);
  };

  return (
    <div>
      <ReactSearchAutocomplete
        items={fetchedData || []}
        onSelect={handleItemSelect}
        autoFocus
        placeholder="Search and select items..."
        formatResult={(item) => (
          <div style={{ display: 'flex', alignItems: 'center', padding: '10px', borderBottom: '1px solid #ccc' }}>
            <p style={{ margin: '0', fontWeight: 'bold' }}>{item.name}</p>
          </div>
        )}
      />
      <input
        type="text"
        value={formula}
        onChange={handleOperandInputChange}
        placeholder="Enter operand (+, -, *)"
        style={{ marginTop: '10px', padding: '5px', width: '100%', boxSizing: 'border-box' }}
      />
      <div style={{ marginTop: '20px' }}>
        <p style={{ margin: '0', fontWeight: 'bold' }}>Total: {total}</p>
      </div>
      <button onClick={handleSaveFormula} style={{ marginTop: '20px' }}>Save</button>
      {/* Display saved formulas */}
      <div style={{ marginTop: '20px' }}>
        <p style={{ margin: '0', fontWeight: 'bold' }}>Saved Formulas:</p>
        {savedFormulas.map((savedFormula, index) => (
          <div key={index}>
            <p style={{ margin: '0' }}>{savedFormula}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
