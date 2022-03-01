import IconQuestion from "assets/images/question.svg";
import { SaleChartState } from 'pages/card/BusinessLogic';
import { formatNumber } from 'utils/helper';
import { HelperSales, UtilsColorGrade } from 'model/data_sport/pricing_grid';

interface Props {
    saleChartState: SaleChartState;
}

const StatisticAverage = ({saleChartState}: Props) => {

    return (
        <div className="table-responsive over-flow-unset">
            <table className="table"  style={{ marginBottom: 0 }}>
                <thead>
                    <tr>
                        <th scope="col">Grade</th>
                        <th scope="col">Latest Value</th>
                        <th scope="col">Lowest Value</th>
                        <th scope="col">Highest Value</th>
                        <th scope="col">Average Value</th>
                        <th scope="col">Total Trades</th>
                        <th scope="col">
                            <span className="me-2">Change</span>
                            <span className="position-relative tool-tip-custom">
                                <img src={IconQuestion} />
                                <span className="position-absolute tool-tip-text">
                                    % from first data
                                </span>

                            </span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        saleChartState.gradeTreeItemSelected.filter(it => !!saleChartState.calcMaLine[it.value])
                            .map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>
                                            <div className="grade-content">
                                             <div className={`custom-grade d-inline-flex ${HelperSales.checkExistGrade(
                                                item.gradeCompany,
                                                ) ? 'custom-grade-bold' : ''}`}
                                                style={{
                                                    backgroundColor: UtilsColorGrade.getColorGrade(item.gradeCompany),
                                                    color: UtilsColorGrade.colorTextTable(item.gradeCompany, item.gradeValue),
                                                }}>
                                                    { HelperSales.getStringGrade(item.gradeCompany, item.gradeValue) }
                                                </div>
                                            </div>
                                        </td>
                                        <td>${formatNumber(saleChartState.calcMaLine[item.value].stats.latest)}</td>
                                        <td>${formatNumber(saleChartState.calcMaLine[item.value].stats.min)}</td>
                                        <td>${formatNumber(saleChartState.calcMaLine[item.value].stats.max)}</td>
                                        <td>${formatNumber(saleChartState.calcMaLine[item.value].stats.average)}</td>
                                        <td>{formatNumber(saleChartState.calcMaLine[item.value].stats.total_trades)}</td>
                                        <td>{formatNumber(saleChartState.calcMaLine[item.value].stats.change)}%</td>
                                    </tr>
                                )
                            })
                    }
                </tbody>
            </table>
        </div>
    );
}

export default StatisticAverage;