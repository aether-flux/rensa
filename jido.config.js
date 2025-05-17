import { jido } from "jido";

const commitCmd = "git commit -m 'change: upgrade package version'";

const config = {
  flows: [
    {
      name: "patch-release",
      description: "Publish patch release.",
      steps: [
        {
          run: "npm version patch",
        },
        {
          run: "git add .",
        },
        {
          run: commitCmd,
        },
        {
          run: "git push",
        },
        {
          run: "npm publish",
        }
      ]
    },
    {
      name: "minor-release",
      description: "Publish minor release.",
      steps: [
        {
          run: "npm version minor",
        },
        {
          run: "git add .",
        },
        {
          run: commitCmd,
        },
        {
          run: "git push",
        },
        {
          run: "npm publish",
        }
      ]
    },
    {
      name: "major-release",
      description: "Publish major release.",
      steps: [
        {
          run: "npm version major",
        },
        {
          run: "git add .",
        },
        {
          run: commitCmd,
        },
        {
          run: "git push",
        },
        {
          run: "npm publish",
        }
      ]
    }
  ]
}

export default jido(config);
