'use client'

import { useDesktopStore } from '@/lib/desktopStore'

export function ShutdownDialog() {
  const open = useDesktopStore((state) => state.shutdownOpen)
  const closeShutdown = useDesktopStore((state) => state.closeShutdown)
  const logOff = useDesktopStore((state) => state.logOff)
  const enterDesktop = useDesktopStore((state) => state.enterDesktop)

  if (!open) {
    return null
  }

  return (
    <div aria-modal="true" className="shutdown-dialog" role="dialog" aria-labelledby="shutdown-title">
      <div className="shutdown-dialog__backdrop" onClick={() => closeShutdown()} />
      <div className="shutdown-dialog__window win95-raised">
        <div className="win95-titlebar">
          <span className="win95-titlebar__title" id="shutdown-title">
            Shut Down custardsquare OS
          </span>
        </div>
        <div className="shutdown-dialog__body">
          <p>What do you want the computer to do?</p>
          <div className="shutdown-dialog__actions">
            <button
              className="win95-button"
              onClick={() => {
                closeShutdown()
                logOff()
              }}
              type="button"
            >
              Log Off
            </button>
            <button
              className="win95-button"
              onClick={() => {
                closeShutdown()
                enterDesktop()
              }}
              type="button"
            >
              Restart
            </button>
            <a className="win95-button" href="https://www.outsideonline.com/" rel="noopener noreferrer">
              Go Outside
            </a>
            <button className="win95-button" onClick={() => closeShutdown()} type="button">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
