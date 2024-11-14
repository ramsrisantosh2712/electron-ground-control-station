import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";

import ICGImage from "@/images/ICG_Image.png";
import ZebuLogo from "@/images/ZEBU_LOGO.png";
import { useDroneUtilsContext } from "@/contexts/DroneStatusContext";
import { getSocket } from "@/lib/utils";

const StartUp = () => {
  const [showIGGImage, setShowIGGImage] = useState(true);
  const socket = getSocket();

  const { droneStatus, setDroneStatus } = useDroneUtilsContext();

  // WIP: Connect the backend
  const callBackEnd = () => {
    // setConnectButton(false)
    setDroneStatus({ ...droneStatus, connectButton: false });

    socket.emit("drone_status");
    socket.emit("start_video_stream");
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowIGGImage(false);
    }, 3000);
  }, []);

  return (
    <>
      <>
        <Transition appear show={showIGGImage} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-[100] w-full h-full"
            onClose={() => {}}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-in-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in-out duration-200"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-white" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-hidden">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  {/* Dialog panel containing the centered image */}
                  <Dialog.Panel className="w-full h-screen max-w-md transform overflow-hidden bg-transparent align-middle transition-all flex items-center justify-center">
                    {/* Image */}
                    <div className="w-full h-full flex flex-col justify-center items-center">
                      <img
                        src={ICGImage}
                        alt="Logo"
                        className="w-auto h-auto max-h-[70vh] max-w-[70vw]"
                      />
                      <img src={ZebuLogo} alt="Logo" className="w-fit" />
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </>

      <>
        <Transition
          appear
          show={!showIGGImage && droneStatus.connectButton}
          as={Fragment}
        >
          <Dialog as="div" className="relative z-[100]" onClose={() => {}}>
            <Transition.Child
              as={Fragment}
              enter="ease- duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 backdrop-blur-3xl" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-center text-3xl font-bold"
                    >
                      Drone is Ready!
                    </Dialog.Title>

                    <button
                      onClick={callBackEnd}
                      className="button mx-auto mt-2"
                    >
                      {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 24">
                                                <path d="m18 0 8 12 10-8-4 20H4L0 4l10 8 8-12z"></path>
                                            </svg> */}
                      Connect
                    </button>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </>
    </>
  );
};

export default StartUp;
