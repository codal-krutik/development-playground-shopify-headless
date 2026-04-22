import Hero from "./sections/hero";

const sectionComponents = {
  hero: Hero,
};

export default function SectionRenderer({ sections, order }) {
  return (
    <>
      {order.map((sectionId) => {
        const section = sections[sectionId];
        const Component = sectionComponents[section.type];

        if (!Component) {
          return (
            <pre key={sectionId}>
              Missing component: {section.type}
            </pre>
          );
        }

        return (
          <Component
            key={sectionId}
            settings={section.settings}
            blocks={section.blocks}
          />
        );
      })}
    </>
  );
}