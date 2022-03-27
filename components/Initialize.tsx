import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import yaml from "js-yaml";
import { useRef } from "react";
import { addPapers, Paper } from "../lib/store";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function Initialize() {
  const papersInputRef = useRef<HTMLInputElement>(null);

  const processPapers = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const target = event.currentTarget as HTMLInputElement;

    if (target.files) {
      const file = target.files[0];
      const read = new FileReader();
      read.readAsText(file);
      read.onloadend = async function () {
        const papers = yaml.load(read.result as string) as Array<Paper>;
        await addPapers(
          papers.map(({ id, title, abstract, authors, attributes }) => {
            return {
              id: String(id),
              title,
              abstract,
              authors,
              attributes: attributes || {},
            };
          })
        );
        window.location.href = "/papers";
      };
    }
  };

  return (
    <Modal open={true}>
      <Box sx={style}>
        <Typography variant="h3">Welcome!</Typography>
        <Button
          onClick={() =>
            papersInputRef.current && papersInputRef.current.click()
          }
        >
          Import Papers
        </Button>
        <input
          type="file"
          id="file"
          ref={papersInputRef}
          style={{ display: "none" }}
          onChange={processPapers}
        />
      </Box>
    </Modal>
  );
}
