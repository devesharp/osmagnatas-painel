import minimist from "minimist";

export const componentGenerator = {
  description: "Criar um novo componente React",
  prompts: [
    {
      type: "input",
      name: "name",
      message: "Nome do componente:",
      validate: (value) => {
        if (!value) {
          return "Nome do componente é obrigatório";
        }
        return true;
      },
    },
  ],
  actions: (data) => {
    const actions = [];
    const dataProcess = minimist(process.argv.slice(2));

    // Determinar o caminho base - usa --dir se fornecido, senão usa src/components
    const baseDir = dataProcess.dir || "src/components";


    let basePath = `${baseDir}/{{kebabCase name}}`;

    // Criar arquivo index.tsx (sempre)
    actions.push({
      type: "add",
      path: `${basePath}/index.tsx`,
      templateFile: "scripts/templates/components/component-index.hbs",
    });

    // Criar componente principal
    actions.push({
      type: "add",
      path: `${basePath}/{{kebabCase name}}.tsx`,
      templateFile: "scripts/templates/components/component.hbs",
    });

    // Criar arquivo de tipos se não for UI
    actions.push({
      type: "add",
      path: `${basePath}/{{kebabCase name}}.types.tsx`,
      templateFile: "scripts/templates/components/component-types.hbs",
    });

    // Criar controller se solicitado e não for UI
    actions.push({
      type: "add",
      path: `${basePath}/{{kebabCase name}}.ctrl.tsx`,
      templateFile: "scripts/templates/components/component-ctrl.hbs",
    });

    // Criar Storybook
    actions.push({
      type: "add",
      path: `${basePath}/{{pascalCase name}}.stories.tsx`,
      templateFile: "scripts/templates/components/component-story.hbs",
    });

    // // Criar teste
    // if (data.withTest) {
    //   actions.push({
    //     type: 'add',
    //     path: `${basePath}/{{pascalCase name}}.test.tsx`,
    //     templateFile: 'scripts/templates/components/component-test.hbs',
    //   });
    // }

    return actions;
  },
};
