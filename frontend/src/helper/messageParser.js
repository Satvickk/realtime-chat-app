export const handleParseMessage = (text) => {
  if (text.startsWith("/weather "))
    return { type: "plugin", plugin: "weather", arg: text.slice(9).trim() };
  if (text.startsWith("/calc "))
    return { type: "plugin", plugin: "calc", arg: text.slice(6).trim() };
  if (text.startsWith("/define "))
    return { type: "plugin", plugin: "define", arg: text.slice(8).trim() };
  return { type: "text", content: text };
};
