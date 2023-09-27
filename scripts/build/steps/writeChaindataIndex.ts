import { getFileList, html, writeChaindataFile } from '../util'
import { sharedData } from './_sharedData'

export const writeChaindataIndex = async () => {
  await writeChains()
  await writeEvmNetworks()

  await writeChaindataFile(
    'index.html',
    html`<html>
      <head>
        <meta name="color-scheme" content="light dark" />
        <style>
          html {
            font-family: sans-serif;
          }
          a {
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <pre style="word-wrap: break-word; white-space: pre-wrap;">
<h3>Chaindata</h3>
${getFileList()
          .slice()
          .sort()
          .map((file) => html`<a href="${file}">${file}</a>`)
          .join('\n')}
      </pre>
      </body>
    </html>`
  )
}

const writeChains = async () => {
  await writeChaindataFile(`chains/all.json`, JSON.stringify(sharedData.chains, null, 2))
  await writeChaindataFile(
    `chains/summary.json`,
    JSON.stringify(
      sharedData.chains.map(
        ({ id, isTestnet, sortIndex, genesisHash, name, themeColor, logo, specName, specVersion }) => ({
          id,
          isTestnet,
          sortIndex,
          genesisHash,
          name,
          themeColor,
          logo,
          specName,
          specVersion,
        })
      ),
      null,
      2
    )
  )

  for (const chain of sharedData.chains) {
    if (typeof chain.id !== 'string') continue
    if (!Array.isArray(chain.rpcs) || chain.rpcs.length < 1) continue

    await writeChaindataFile(`chains/byId/${chain.id}.json`, JSON.stringify(chain, null, 2))

    if (typeof chain.genesisHash !== 'string') continue
    await writeChaindataFile(`chains/byGenesisHash/${chain.genesisHash}.json`, JSON.stringify(chain, null, 2))
  }
}

const writeEvmNetworks = async () => {
  await writeChaindataFile(`evmNetworks/all.json`, JSON.stringify(sharedData.evmNetworks, null, 2))
  await writeChaindataFile(
    `evmNetworks/summary.json`,
    JSON.stringify(
      sharedData.evmNetworks.map(({ id, isTestnet, sortIndex, name, themeColor, logo }) => ({
        id,
        isTestnet,
        sortIndex,
        name,
        themeColor,
        logo,
      })),
      null,
      2
    )
  )

  for (const evmNetwork of sharedData.evmNetworks) {
    if (typeof evmNetwork.id !== 'string') continue
    if (!Array.isArray(evmNetwork.rpcs) || evmNetwork.rpcs.length < 1) continue

    await writeChaindataFile(`evmNetworks/byId/${evmNetwork.id}.json`, JSON.stringify(evmNetwork, null, 2))
  }
}
