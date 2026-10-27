export const colors = {
  bg: "#F5F3EB",
  paper: "#FFFFFF",
  ink: "#173F35",
  muted: "#748078",
  green: "#26694E",
  lime: "#DFEDB1",
  line: "#E3E6DC",
  red: "#A83F32",
  orange: "#A65F13",
};
export const money = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const dateLabel = (date: string) => date.split("-").reverse().join("/");
