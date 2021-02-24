import React, { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { showPage } from "../../../store/actionCreators"
import { PageId } from "../../../store/storeTypes"

export const OpenSearchPageButton: React.FunctionComponent = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const onClick = useCallback(() => {
    dispatch(showPage(PageId.Search))
  }, [dispatch])

  return (
    <div id="map-button-search" className="map-button">
      <button
        type="button"
        className="btn btn-primary"
        title={t(`common.button.search`)}
        onClick={onClick}
      >
        <span className="glyphicon glyphicon-search" aria-hidden="true" />
      </button>
    </div>
  )
}
