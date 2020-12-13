import * as React from "react"
import {
  RKYPisteArgisFeature,
  RKYAlueArgisFeature,
  RKYViivaArgisFeature,
  MuseovirastoLayer,
  ModelFeatureProperties
} from "../../../../common/types"
import { ArgisFeatureCollapsePanel } from "../component/FeatureCollapsePanel"
import { Field } from "../component/Field"
import { MuseovirastoLink } from "../component/MuseovirastoLink"
import { EmbeddedModels } from "../component/EmbeddedModels"

interface Props {
  isOpen: boolean
  onToggleOpen: () => void
  feature: RKYPisteArgisFeature | RKYAlueArgisFeature | RKYViivaArgisFeature
  models?: Array<ModelFeatureProperties>
}

export const RKYPanel: React.FC<Props> = ({
  isOpen,
  onToggleOpen,
  feature,
  models = []
}) => {
  return (
    <ArgisFeatureCollapsePanel
      isOpen={isOpen}
      onToggleOpen={onToggleOpen}
      feature={feature}
      has3dModels={models.length > 0}
    >
      <form>
        <Field label="Kohdenimi" value={feature.attributes.kohdenimi} />
        {feature.layerName === MuseovirastoLayer.RKY_alue && (
          <Field label="Nimi" value={feature.attributes.nimi} />
        )}
        <MuseovirastoLink feature={feature} />
        {isOpen && <EmbeddedModels models={models} />}
      </form>
    </ArgisFeatureCollapsePanel>
  )
}