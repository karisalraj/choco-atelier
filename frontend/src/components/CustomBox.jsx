
import { useMemo, useState } from "react";
import "./CustomBox.css";

const boxSizes = [
  { pieces: 6, price: 480 },
  { pieces: 12, price: 850 },
  { pieces: 18, price: 1200 },
];


const chocolateTypes = [
  {
    id: "noir",
    name: "Midnight Noir",
    style: "noir",
    image: "/chocolates/midnight-noir.png",
  },
  {
    id: "milk",
    name: "Velvet Milk",
    style: "milk",
    image: "/chocolates/velvet-milk.png",
  },
  {
    id: "hazelnut",
    name: "Hazelnut Dream",
    style: "hazelnut",
    image: "/chocolates/hazelnut-dream.png",
  },
  {
    id: "caramel",
    name: "Caramel Dusk",
    style: "caramel",
    image: "/chocolates/caramel-dusk.png",
  },
];

function CustomBox({ onAddToCart }) {
  const [boxSize, setBoxSize] = useState(boxSizes[0]);
  const [selectedChocolates, setSelectedChocolates] = useState([]);
  const [added, setAdded] = useState(false);

  const selectedCount = selectedChocolates.length;
  const remaining = boxSize.pieces - selectedCount;

  const countsByType = useMemo(() => {
    return selectedChocolates.reduce((counts, id) => {
      counts[id] = (counts[id] || 0) + 1;
      return counts;
    }, {});
  }, [selectedChocolates]);

  const chooseBoxSize = (size) => {
    setBoxSize(size);
    setSelectedChocolates((current) => current.slice(0, size.pieces));
    setAdded(false);
  };

  const addChocolate = (id) => {
    if (selectedChocolates.length >= boxSize.pieces) return;

    setSelectedChocolates((current) => [...current, id]);
    setAdded(false);
  };

  const removeChocolate = (index) => {
    setSelectedChocolates((current) =>
      current.filter((_, itemIndex) => itemIndex !== index)
    );
    setAdded(false);
  };

  const resetBox = () => {
    setSelectedChocolates([]);
    setAdded(false);
  };

  return (
    <section className="custom-box-section" id="custom-box">
      <div className="custom-box-container">
        <header className="custom-box-heading">
          <p className="custom-box-eyebrow">A LITTLE BOX, MADE BY YOU</p>
          <h2>Create Your Own <em>Chocolate Box</em></h2>
          <p>
            Choose your box size, then fill it with the chocolates you love.
          </p>
        </header>

        <div className="custom-box-layout">
          <div className="custom-box-builder">
            <div className="custom-box-step-heading">
              <span>01</span>
              <div>
                <h3>Choose your box size</h3>
                <p>Select how many chocolates you want.</p>
              </div>
            </div>

            <div className="custom-box-size-options">
              {boxSizes.map((size) => (
                <button
                  key={size.pieces}
                  type="button"
                  className={`custom-box-size ${
                    boxSize.pieces === size.pieces ? "is-selected" : ""
                  }`}
                  aria-pressed={boxSize.pieces === size.pieces}
                  onClick={() => chooseBoxSize(size)}
                >
                  <span>{size.pieces} pieces</span>
                  <strong>₹{size.price.toLocaleString("en-IN")}</strong>
                </button>
              ))}
            </div>

            <div className="custom-box-step-heading custom-box-second-step">
              <span>02</span>
              <div>
                <h3>Choose your chocolates</h3>
                <p>
                  Add chocolates until your box is full. You can mix varieties.
                </p>
              </div>
            </div>

            <div className="custom-chocolate-options">
                
              {chocolateTypes.map((chocolate) => (
                
                
                <button
                  key={chocolate.id}
                  type="button"
                  className="custom-chocolate-option"
                  disabled={remaining === 0}
                  onClick={() => addChocolate(chocolate.id)}
                >
                  
<img
  className="custom-chocolate-image"
  src={chocolate.image}
  alt={chocolate.name}
  loading="lazy"
/>
                  <span className="custom-chocolate-name">{chocolate.name}</span>
                  <span className="custom-chocolate-add">
                    {remaining === 0 ? "Box Full" : "+ Add"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <aside className="custom-box-preview">
            <div className="custom-box-preview-heading">
              <div>
                <p className="custom-box-eyebrow">YOUR CREATION</p>
                <h3>Chocolate Box</h3>
              </div>
              <button type="button" onClick={resetBox}>
                Reset
              </button>
            </div>

            <div
              className={`custom-box-grid box-size-${boxSize.pieces}`}
              aria-label={`Custom chocolate box preview, ${selectedCount} of ${boxSize.pieces} selected`}
            >
              {Array.from({ length: boxSize.pieces }, (_, index) => {
                const chocolateId = selectedChocolates[index];
                const chocolate = chocolateTypes.find(
                  (item) => item.id === chocolateId
                );

                return (
                  <button
                    key={index}
                    type="button"
                    className={`custom-box-slot ${
                      chocolate ? "is-filled" : "is-empty"
                    }`}
                    aria-label={
                      chocolate
                        ? `Remove ${chocolate.name} from slot ${index + 1}`
                        : `Empty slot ${index + 1}`
                    }
                    disabled={!chocolate}
                    onClick={() => removeChocolate(index)}
                  >
                    
{chocolate ? (
  <img
    className="custom-box-piece-image"
    src={chocolate.image}
    alt={chocolate.name}
    draggable="false"
  />
) : (
  <span className="custom-box-slot-plus">+</span>
)}
                  </button>
                );
              })}
            </div>

            <div className="custom-box-progress">
              <div className="custom-box-progress-label">
                <span>{selectedCount} of {boxSize.pieces} selected</span>
                <span>{remaining} remaining</span>
              </div>
              <div className="custom-box-progress-track">
                <span
                  style={{
                    width: `${(selectedCount / boxSize.pieces) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="custom-box-total">
              <span>Box total</span>
              <strong>₹{boxSize.price.toLocaleString("en-IN")}</strong>
            </div>

            <button
              className="custom-box-add-button"
              type="button"
              disabled={selectedCount !== boxSize.pieces}
              
onClick={() => {
onAddToCart({
  cartKey: `custom-box-${Date.now()}`,
  itemType: "custom-box",
  name: `Custom Chocolate Box (${boxSize.pieces} pieces)`,
  price: boxSize.price,
  pieces: boxSize.pieces,

  image: "/products/custom-chocolate-box.png",

  chocolates: selectedChocolates.map((id) => {
    const chocolate = chocolateTypes.find((item) => item.id === id);
    return chocolate?.name;
  }),
});

  setAdded(true);
}}
            >
              {added ? "Custom Box Added ✓" : "Add Custom Box to Bag"}
            </button>

            {added && (
              <p className="custom-box-feedback" role="status">
                Your {boxSize.pieces}-piece custom box is ready.
                Cart integration will be connected in the cart step.
              </p>
            )}

            {selectedCount !== boxSize.pieces && (
              <p className="custom-box-helper">
                Select {remaining} more chocolate{remaining === 1 ? "" : "s"} to
                complete your box.
              </p>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}

export default CustomBox;