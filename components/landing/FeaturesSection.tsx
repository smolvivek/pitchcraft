"use client";

export function FeaturesSection() {
  const sections = [
    {
      title: "One link. Your entire project.",
      body: [
        "Logline, synopsis, vision, budget, team. Flow, locations, crew, world-building.",
        "",
        "Everything a producer needs to say yes. No templates. Your work, your control.",
      ],
    },
    {
      title: "Build it once. Share it forever.",
      body: [
        "Fill 8 required fields. Add production details. Share one link.",
        "",
        "Every project lives at its own URL. Update it. Version it. No middleman.",
      ],
    },
    {
      title: "Built for creators, not platforms.",
      body: [
        "Filmmakers. Writers. Ad creatives. Directors.",
        "",
        "If you make something and need funding, this is for you.",
      ],
    },
  ];

  return (
    <section className="py-[120px] px-[24px]">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[64px]">
          {sections.map((section, index) => (
            <div key={index}>
              <h2 className="font-[var(--font-heading)] text-[24px] font-semibold leading-[32px] text-text-primary mb-[24px]">
                {section.title}
              </h2>
              <div className="space-y-[16px]">
                {section.body.map((line, lineIndex) => (
                  <p
                    key={lineIndex}
                    className={`text-[16px] leading-[24px] ${
                      line === "" ? "h-[8px]" : "text-text-secondary"
                    }`}
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
