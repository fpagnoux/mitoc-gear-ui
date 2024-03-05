type Props = {
  updateTab: (newTab: PersonPageTabs) => void;
  activeTab: PersonPageTabs;
};

export enum PersonPageTabs {
  gearOut = "gearOut",
  rentGear = "rentGear",
  buyGear = "buyGear",
  rentalHistory = "rentalHistory",
}

const tabs = [
  { name: PersonPageTabs.gearOut, label: "Gear out" },
  { name: PersonPageTabs.rentGear, label: "Rent Gear", shortLabel: "Rent" },
  { name: PersonPageTabs.buyGear, label: "Buy Gear", shortLabel: "Buy" },
  {
    name: PersonPageTabs.rentalHistory,
    label: "Rental History",
    shortLabel: "Hist.",
  },
];

export function PersonTabsSelector({ activeTab, updateTab }: Props) {
  return (
    <ul className="nav nav-tabs">
      {tabs.map((tab) => (
        <li className="nav-item" key={tab.name}>
          <button
            className={`nav-link ${tab.name === activeTab ? "active" : ""}`}
            onClick={() => updateTab(tab.name)}
          >
            <span className="d-none d-md-inline">{tab.label}</span>
            <span className="d-md-none">{tab.shortLabel ?? tab.label}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
