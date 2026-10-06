import { parseRichText } from "@/lib/rich-text";

/** Renders a post body's bold and italic markers as real emphasis. */
export default function RichText({ content }: { content: string }) {
  return (
    <>
      {parseRichText(content).map((run, index) => {
        let node: React.ReactNode = run.text;

        if (run.italic) node = <em>{node}</em>;
        if (run.bold) node = <strong>{node}</strong>;

        return <span key={index}>{node}</span>;
      })}
    </>
  );
}
