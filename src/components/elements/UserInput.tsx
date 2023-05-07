import { useState } from "react";
import { ActionIcon, Flex, TextInput, Paper } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { useForm, hasLength } from "@mantine/form";
import { IconSend } from "@tabler/icons-react";
import { useChatGPT } from "@/hooks/useChatGPT";

export const UserInput = () => {
  const matches = useMediaQuery(`(min-width: 1024px)`);
  const { fetchStream } = useChatGPT();

  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm({
    initialValues: {
      text: "",
    },
    validate: {
      text: hasLength({ min: 2 }, "2文字以上必要です"),
    },
  });

  const onSubmit = async (values: { text: string }) => {
    if (values.text.length < 2) {
      showNotification({
        title: `入力エラー`,
        message: "2文字以上にする必要があります",
        color: "red",
        autoClose: 5000,
      });
      return;
    }

    form.reset();
    setLoading(true);
    await fetchStream({ role: "user", content: values.text });
    setLoading(false);
  };

  return (
    <>
      <Flex
        w="100%"
        direction="column"
        align="center"
        sx={{
          position: "absolute",
          bottom: 16,
          pointerEvents: loading ? "none" : "auto",
        }}
      >
        <Paper
          shadow="md"
          radius={16}
          sx={{
            backgroundColor: "transparent",
          }}
        >
          <form className="w-full" onSubmit={form.onSubmit(onSubmit)}>
            <Flex justify="center">
              <TextInput
                radius={10}
                h={matches ? 48 : 40}
                size={matches ? "md" : "sm"}
                placeholder="なにをしゃべろう？？"
                {...form.getInputProps("text")}
                rightSection={
                  <ActionIcon
                    radius="xl"
                    mr={8}
                    color={"teal"}
                    onClick={() => {
                      onSubmit(form.values);
                    }}
                  >
                    <IconSend size={24} color="teal" />
                  </ActionIcon>
                }
                styles={() => ({
                  rightSection: {
                    width: "unset",
                  },
                  input: {
                    border: "none",
                    minHeight: matches ? 48 : 40,
                    backgroundColor: "rgba(255, 255, 255, 0.4)",
                    backdropFilter: "blur(6px)",
                  },
                })}
              />
            </Flex>
          </form>
        </Paper>
      </Flex>
    </>
  );
};
