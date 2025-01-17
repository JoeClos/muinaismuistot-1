import React from "react"
import { MuinaisjaannosPisteArgisFeature } from "../../../../common/types"
import {
  ArgisFeatureCollapsePanel,
  FeatureTitleClickAction
} from "../component/FeatureCollapsePanel"
import { Field } from "../component/Field"
import { TimespanLabel } from "../component/TimespanLabel"
import { MuseovirastoLink } from "../component/MuseovirastoLink"
import { EmbeddedModels } from "../component/EmbeddedModels"
import { MaisemanMuistiField } from "../component/MaisemanMuistiField"
import { useTranslation } from "react-i18next"
import {
  getArkeologisenKulttuuriperinnonOpasLinkForSubType,
  getArkeologisenKulttuuriperinnonOpasLinkForType
} from "../../../../common/util/wikiLinkHelper"
import { Link } from "../../Link"

interface Props {
  titleClickAction: FeatureTitleClickAction
  isOpen: boolean
  onToggleOpen: () => void
  feature: MuinaisjaannosPisteArgisFeature
}

function renderList<T extends string>(
  data: Array<T>,
  contentFn: (row: T) => JSX.Element
) {
  if (data.length === 0) {
    return null
  }
  if (data.length === 1) {
    return contentFn(data[0])
  }

  return (
    <ul>
      {data.map((row) => (
        <li key={row}>{contentFn(row)}</li>
      ))}
    </ul>
  )
}

export const MuinaisjaannosPistePanel: React.FC<Props> = ({
  titleClickAction,
  isOpen,
  onToggleOpen,
  feature
}) => {
  const { t } = useTranslation()
  const {
    kohdenimi,
    kunta,
    ajoitusSplitted,
    tyyppiSplitted,
    alatyyppiSplitted,
    laji
  } = feature.attributes
  return (
    <ArgisFeatureCollapsePanel
      titleClickAction={titleClickAction}
      isOpen={isOpen}
      onToggleOpen={onToggleOpen}
      feature={feature}
    >
      <form>
        <Field label={t(`details.field.featureName`)} value={kohdenimi} />
        <Field label={t(`details.field.municipality`)} value={kunta} />
        <Field label={t(`details.field.dating`)}>
          {renderList(ajoitusSplitted, (ajoitus) => (
            <p>
              <span>{t(`data.museovirasto.dating.${ajoitus}`, ajoitus)}</span>{" "}
              <TimespanLabel dating={ajoitus} />
            </p>
          ))}
        </Field>
        <Field label={t(`details.field.type`)}>
          {renderList(tyyppiSplitted, (tyyppi) => {
            return (
              <Link
                text={t(`data.museovirasto.type.${tyyppi}`, tyyppi)}
                url={getArkeologisenKulttuuriperinnonOpasLinkForType(tyyppi)}
              />
            )
          })}
        </Field>
        <Field label={t(`details.field.subType`)}>
          {renderList(alatyyppiSplitted, (alatyyppi) => {
            return (
              <Link
                text={t(`data.museovirasto.subtype.${alatyyppi}`, alatyyppi)}
                url={getArkeologisenKulttuuriperinnonOpasLinkForSubType(
                  alatyyppi
                )}
              />
            )
          })}
        </Field>
        <Field
          label={t(`details.field.featureType`)}
          value={t(`data.museovirasto.featureType.${laji}`, laji)}
        />

        {feature.maisemanMuisti.length > 0 && (
          <MaisemanMuistiField feature={feature.maisemanMuisti[0]} />
        )}

        <MuseovirastoLink feature={feature} />

        {isOpen && <EmbeddedModels models={feature.models} />}
      </form>
    </ArgisFeatureCollapsePanel>
  )
}
