import { Chart, ScriptableTooltipContext, ChartType } from "chart.js";
import { SaleData } from "model/data_sport/card_sport";
import moment from "moment";
import { formatCurrency } from "utils/helper";

const getOrCreateTooltip = (chart: Chart) => {
  let tooltipEl = chart.canvas.parentNode?.querySelector("div");

  if (!tooltipEl) {
    tooltipEl = document.createElement("div");
    tooltipEl.style.background = "rgba(0, 0, 0, 0.7)";
    tooltipEl.style.borderRadius = "3px";
    tooltipEl.style.color = "white";
    tooltipEl.style.opacity = "1";
    tooltipEl.style.pointerEvents = "none";
    tooltipEl.style.position = "absolute";
    tooltipEl.style.transform = "translate(-50%, 0)";
    tooltipEl.style.transition = "all .1s linear";

    const table = document.createElement("table");
    table.style.margin = "0px";

    tooltipEl.appendChild(table);
    chart.canvas.parentNode?.appendChild(tooltipEl);
  }

  return tooltipEl;
};

const externalTooltipHandler = (context: any, listRecord: SaleData[]) => {
  
  // Tooltip Element
  const { chart, tooltip } = context as ScriptableTooltipContext<any>;
  if (tooltip.dataPoints.length <= 0) {
    return;
  }
  const tooltipEl = getOrCreateTooltip(chart);

  let dataType: ChartType = tooltip.dataPoints[0].dataset.type;

  // Hide if no tooltip
  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = "0";
    return;
  }

  // Set Text
  if (tooltip.body) {
    switch (dataType) {
      case "line": {
        let itemDataChart =
          tooltip.dataPoints[0].dataset.data[tooltip.dataPoints[0].dataIndex];

        const tableHead = document.createElement("thead");

        const trDate = document.createElement("tr");
        const th = document.createElement("th");
        const date = document.createTextNode(
          `${moment(new Date(+itemDataChart.x)).format("MMM DD, YYYY")}`
        );

        th.appendChild(date);
        trDate.appendChild(th);
        tableHead.appendChild(trDate);

        const tableBody = document.createElement("tbody");

        const tr = document.createElement("tr");
        tr.style.backgroundColor = "inherit";
        tr.style.borderWidth = "0";

        const td = document.createElement("td");
        td.style.borderWidth = "0";



        const underLineText = document.createElement('u');
        const priceValue = document.createTextNode(
          `Mickey Mantle MA(28): ${ formatCurrency(itemDataChart.y)}`
        );
        underLineText.appendChild(priceValue);

        td.appendChild(underLineText);
        tr.appendChild(td);

        const label = document.createElement("tr");
        label.style.fontSize = "14px";

        const labelTextNode = document.createTextNode(
          "MA(28) = 28 Day Moving Average"
        );
        label.appendChild(labelTextNode);

        tableBody.appendChild(tr);
        tableBody.appendChild(label);

        const tableRoot = tooltipEl.querySelector("table");
        // Remove old children
        while (tableRoot?.firstChild) {
          tableRoot.firstChild.remove();
        }
        if (tableRoot) {
          tableRoot.appendChild(tableHead);
          tableRoot.appendChild(tableBody);
        }

        break;
      }

      default:
        {
          let itemDataChart =
            tooltip.dataPoints[0].dataset.data[tooltip.dataPoints[0].dataIndex];
          let itemData = listRecord[tooltip.dataPoints[0].dataIndex];
          const titleLines = tooltip.title || [];
          const bodyLines = tooltip.body.map((b) => b.lines);

          const tableHead = document.createElement("thead");

          titleLines.forEach((title) => {
            const tr = document.createElement("tr");
            tr.style.borderWidth = "0";

            const th = document.createElement("th");
            th.style.borderWidth = "0";
            const text = document.createTextNode(title);

            th.appendChild(text);
            tr.appendChild(th);
            tableHead.appendChild(tr);
          });

          const tableBody = document.createElement("tbody");
          bodyLines.forEach((body, i: number) => {
            const colors = tooltip.labelColors[i];

            const span = document.createElement("span");
            span.style.background = `${colors.backgroundColor}`;
            span.style.borderColor = `${colors.borderColor}`;
            span.style.borderWidth = "2px";
            span.style.marginRight = "10px";
            span.style.height = "10px";
            span.style.width = "10px";
            span.style.display = "inline-block";

            const tr = document.createElement("tr");
            tr.style.backgroundColor = "inherit";
            tr.style.borderWidth = "0";

            const td = document.createElement("td");
            td.style.borderWidth = "0";

            const text = document.createTextNode((body[i]));

            td.appendChild(span);
            td.appendChild(text);
            tr.appendChild(td);
            tableBody.appendChild(tr);
          });

          const tableRoot = tooltipEl.querySelector("table");

          // Remove old children
          while (tableRoot?.firstChild) {
            tableRoot.firstChild.remove();
          }

          // Add new children
          tableRoot?.appendChild(tableHead);
          tableRoot?.appendChild(tableBody);
        }

        break;
    }
  }

  const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

  // Display, position, and set styles for font
  tooltipEl.style.opacity = "1";
  tooltipEl.style.left = positionX + tooltip.caretX + "px";
  tooltipEl.style.top = positionY + tooltip.caretY + "px";
  tooltipEl.style.font = `${tooltip.options.bodyFont}`;
  tooltipEl.style.padding =
    tooltip.options.padding + "px " + tooltip.options.padding + "px";
};

export { getOrCreateTooltip, externalTooltipHandler };
