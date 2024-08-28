import { View, Text } from "react-native";

export function Score({ score, maxScore }) {
  const getColor = () => {
    const percentage = (score / maxScore) * 100;
    if (percentage < 40) return "bg-red-500";
    if (percentage < 98) return "bg-yellow-500";
    return "bg-green-500";
  };

  const className = getColor();

  return (
    <View
      
    >
      <Text >{score}</Text>
    </View>
  );
}
