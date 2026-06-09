import { useState } from "react";
import Tier0 from "./tiers/Tier0.jsx";
import Tier1 from "./tiers/Tier1.jsx";
import Tier2 from "./tiers/Tier2.jsx";
import Tier3 from "./tiers/Tier3.jsx";
import Tier4 from "./tiers/Tier4.jsx";
import Tier5 from "./tiers/Tier5.jsx";
import Tier6 from "./tiers/Tier6.jsx";
import Tier7 from "./tiers/Tier7.jsx";

const tiers = [
    { id: 0, title: "Tier 0 - Component đầu tiên", component: <Tier0 /> },
    { id: 1, title: "Tier 1 - React Flow", component: <Tier1 /> },
    { id: 2, title: "Tier 2 - JSX Variables", component: <Tier2 /> },
    { id: 3, title: "Tier 3 - Component Split", component: <Tier3 /> },
    { id: 4, title: "Tier 4 - useState", component: <Tier4 /> },
    { id: 5, title: "Tier 5 - Events", component: <Tier5 /> },
    { id: 6, title: "Tier 6 - Lists & CRUD", component: <Tier6 /> },
    { id: 7, title: "Tier 7 - Todo App", component: <Tier7 /> }
];

function App() {
    const [currentTier, setCurrentTier] = useState(0);
    const selectedTier = tiers.find(tier => tier.id === currentTier);

    return (
        <div className="app-layout">
            <aside className="sidebar">
                <h1>React Basics v2</h1>
                <p>Project làm theo README và các đầu bài Tier 0 đến Tier 7.</p>

                {tiers.map(tier => (
                    <button
                        key={tier.id}
                        className={currentTier === tier.id ? "nav-button active" : "nav-button"}
                        onClick={() => setCurrentTier(tier.id)}
                    >
                        {tier.title}
                    </button>
                ))}
            </aside>

            <main className="main-content">
                {selectedTier.component}
            </main>
        </div>
    );
}

export default App;
