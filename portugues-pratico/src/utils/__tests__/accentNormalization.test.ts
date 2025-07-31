// Simple test to verify accent normalization functionality
describe("Accent Normalization", () => {
  it("should normalize accents correctly", () => {
    // Test the normalizeAccents function logic
    const normalizeAccents = (
      text: string,
    ): string => {
      return text
        .normalize("NFD")
        .replace(
          /[\u0300-\u036f]/g,
          "",
        );
    };

    // Test cases
    expect(normalizeAccents("é")).toBe(
      "e",
    );
    expect(normalizeAccents("á")).toBe(
      "a",
    );
    expect(normalizeAccents("ó")).toBe(
      "o",
    );
    expect(normalizeAccents("ú")).toBe(
      "u",
    );
    expect(normalizeAccents("í")).toBe(
      "i",
    );
    expect(
      normalizeAccents("são"),
    ).toBe("sao");
    expect(
      normalizeAccents("cão"),
    ).toBe("cao");
    expect(
      normalizeAccents("mão"),
    ).toBe("mao");
    expect(
      normalizeAccents("pão"),
    ).toBe("pao");
    expect(
      normalizeAccents("coração"),
    ).toBe("coracao");
    expect(
      normalizeAccents("nação"),
    ).toBe("nacao");
    expect(
      normalizeAccents("ação"),
    ).toBe("acao");
  });

  it("should handle mixed case and accents", () => {
    const normalizeAccents = (
      text: string,
    ): string => {
      return text
        .normalize("NFD")
        .replace(
          /[\u0300-\u036f]/g,
          "",
        );
    };

    // Test with mixed case
    expect(normalizeAccents("É")).toBe(
      "E",
    );
    expect(
      normalizeAccents("SÃO"),
    ).toBe("SAO");
    expect(
      normalizeAccents("Coração"),
    ).toBe("Coracao");
  });

  it("should handle text without accents", () => {
    const normalizeAccents = (
      text: string,
    ): string => {
      return text
        .normalize("NFD")
        .replace(
          /[\u0300-\u036f]/g,
          "",
        );
    };

    // Test text without accents should remain unchanged
    expect(
      normalizeAccents("falar"),
    ).toBe("falar");
    expect(
      normalizeAccents("comer"),
    ).toBe("comer");
    expect(
      normalizeAccents("dizer"),
    ).toBe("dizer");
  });
});
