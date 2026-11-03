import { createWidget } from "expo-widgets";
import {
  Button,
  Divider,
  HStack,
  Spacer,
  Text,
  VStack,
} from "@expo/ui/swift-ui";
import {
  buttonStyle,
  containerBackground,
  font,
  foregroundStyle,
  frame,
  padding,
} from "@expo/ui/swift-ui/modifiers";

export type ReproWidgetProps = {
  entry: number;
  entries: number;
  at: string;
  taps: number;
};

const ReproWidgetLayout = (props: ReproWidgetProps) => {
  "widget";

  const labels = ["Again", "Hard", "Good", "Easy"];

  return (
    <VStack
      modifiers={[containerBackground("white", "widget"), padding({ all: 16 })]}
    >
      <HStack>
        <Text modifiers={[font({ size: 13, weight: "semibold" })]}>
          {`Entry ${props.entry + 1} of ${props.entries}`}
        </Text>
        <Spacer />
        <Text modifiers={[font({ size: 13 }), foregroundStyle("secondary")]}>
          {props.at}
        </Text>
      </HStack>
      <Spacer />
      <Text
        modifiers={[font({ size: 40, weight: "bold" })]}
      >{`${props.taps}`}</Text>
      <Text modifiers={[font({ size: 15 }), foregroundStyle("secondary")]}>
        taps handled by this entry
      </Text>
      <Spacer />
      <Divider />
      <HStack modifiers={[padding({ top: 12 })]}>
        {labels.map((label, index) => (
          <Button
            key={label}
            target={`tap-${index}-${props.taps}`}
            onPress={() => ({ ...props, taps: props.taps + 1 })}
            modifiers={[buttonStyle("bordered")]}
          >
            <VStack modifiers={[frame({ maxWidth: 1000 })]}>
              <Text modifiers={[font({ size: 15, weight: "semibold" })]}>
                {label}
              </Text>
              <Text
                modifiers={[font({ size: 12 }), foregroundStyle("secondary")]}
              >
                {`${index + 1}m`}
              </Text>
            </VStack>
          </Button>
        ))}
      </HStack>
    </VStack>
  );
};

export const ReproWidget = createWidget<ReproWidgetProps>(
  "ReproWidget",
  ReproWidgetLayout,
);
