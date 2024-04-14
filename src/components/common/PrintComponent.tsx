import React from "react";
import ReactDOMServer from "react-dom/server";

function PrintComponent({
  contentToPrint,
  triggerButtonComponent,
}: {
  triggerButtonComponent: React.ReactElement;
  contentToPrint: React.ReactElement;
}) {
  const handlePrint = () => {
    // Convert React component to HTML string
    const htmlString = ReactDOMServer.renderToString(contentToPrint);
    const printWindow = window.open("", "", "width=600,height=600");
    printWindow?.document.open();
    printWindow?.document.write(
      "<html><head><title>Twofa Security App</title></head><body>"
    );
    printWindow?.document.write('<div class="printable-content">');
    printWindow?.document.write(htmlString);
    printWindow?.document.write("</div></body></html>");
    printWindow?.document.close();
    printWindow?.print();
    printWindow?.close();
  };

  return (
    <div>
      <div onClick={handlePrint}>{triggerButtonComponent}</div>
      <div className="hidden">
        {/* Place the content you want to print here */}
        {contentToPrint}
      </div>
    </div>
  );
}

export default PrintComponent;
