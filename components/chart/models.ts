import { api } from "configs/axios";
import { WidgetSettings } from "interfaces";

export const isNumber = (table_data:string) => {
  return ( table_data === 'totalUni' || table_data === 'total' );
}

export const analyticsUpdateWidget = async (widgetSettings: WidgetSettings, collection?: string, filter?: string) => {
  const params = {
    group_ref: collection ?? "all",
    widgetid: widgetSettings.id,
    widget_settings: {
      type: widgetSettings.type,
      lv1: widgetSettings.lv1,
      lv2: widgetSettings.lv2,
      data: widgetSettings.data,
      user_pp: widgetSettings.user_pp ??"n",
      moving_av: "28",
      filter: filter
    }
  }
  const res = await api.v1.analytics.analyticsUpdateWidget(params);
  return res
}