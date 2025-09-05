import { componentGenerator } from "./scripts/generators/generator-component.js";
import { pageGenerator } from "./scripts/generators/generator-page.js";
import { pageConfigGenerator } from "./scripts/generators/generator-page-config.js";
import { pageFormGenerator } from "./scripts/generators/generator-page-form.js";

export default function PlopFile(plop) {
  // Configurar helpers personalizados
  plop.setHelper("camelCase", (text) => {
    return text.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  });

  plop.setHelper("kebabCase", (text) => {
    return text.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  });

  plop.setHelper("pascalCase", (text) => {
    return text.replace(/(^\w|-\w)/g, (text) =>
      text.replace(/-/, "").toUpperCase()
    );
  });

  plop.setHelper("titleCase", (text) => {
    return text.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  });

  // Helper para comparação
  plop.setHelper("eq", (a, b) => {
    return a === b;
  });

  plop.setHelper("ne", (a, b) => {
    return a !== b;
  });

  // Registrar geradores
  plop.setGenerator("component", componentGenerator);
  plop.setGenerator("page", pageGenerator);
  plop.setGenerator("page-config", pageConfigGenerator);
  plop.setGenerator("page-form", pageFormGenerator);
}
