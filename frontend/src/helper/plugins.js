export const runPlugin = async (plugin, arg) => {
  switch (plugin) {
    case "weather": {
      const apiKey = "20d960ed8f5a48eab2390723252305";
      const res = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(
          arg
        )}`
      );
      const data = await res.json();

      if (data.error) {
        return {
          pluginName: "weather",
          pluginData: {
            error: `Could not find weather for "${arg}"`,
          },
        };
      }
      return {
        pluginName: "weather",
        pluginData: {
          city: data.location.name,
          country: data.location.country,
          temp: data.current.temp_c,
          desc: data.current.condition.text,
          icon: data.current.condition.icon,
        },
      };
    }

    case "calc": {
      try {
        const result = eval(arg);
        return {
          pluginName: "calc",
          pluginData: { expression: arg, result },
        };
      } catch {
        return {
          pluginName: "calc",
          pluginData: { error: "Invalid expression" },
        };
      }
    }

    case "define": {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${arg}`
      );
      const data = await res.json();
      return {
        pluginName: "define",
        pluginData: {
          word: arg,
          meanings: data[0]?.meanings?.map((m) => m.definitions[0]?.definition),
        },
      };
    }

    default: {
      return { pluginName: plugin, pluginData: { error: "Unknown plugin" } };
    }
  }
};
