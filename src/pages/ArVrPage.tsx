import { CaseStudyLayout, Figure } from '../components/CaseStudyLayout'
import { CaseStudyVideo } from '../components/CaseStudyVideo'
import type { TocItem } from '../data/formaCaseStudy'
import { CDN } from '../data/projects'

const toc: TocItem[] = [
  { id: 'intro-page', label: 'AR/VR Design' },
  { id: 'vr-keyboard', label: 'VR Keyboard Design' },
  { id: 'space-invader', label: 'Mobile AR Space Invader' },
  { id: 'makerspace', label: 'VR Maker Space' },
  { id: 'simulator', label: '360 Car Simulator' },
  { id: 'annotate', label: 'Annotate All!' },
]

const img = {
  hero: `${CDN}/1560628466725-X2CISGSPR9AIAK5XBVKS/image-asset.jpeg`,
  poster: `${CDN}/1560627807765-9WA96YQM464YJFCL4NCN/cvpr19_Po+Yen+Tseng.001.jpeg`,
  ml1: `${CDN}/1561492572653-8N6MD735ZGDVRWHE94XB/ML1+explain.png`,
  photo1: `${CDN}/1561490940977-8X0YG2D2C16ZEA9EPUCJ/IMG_9569.JPG`,
  photo2: `${CDN}/1561490968984-A7EP22YNMVGV709UHRRE/image-asset.jpeg`,
  overview: `${CDN}/1561500740222-WGU6MGDZUEUI7M8U0TZL/image-asset.png`,
  annotator: `${CDN}/1561500750316-RMZ13CVXT4O6T1G508YW/image-asset.png`,
  advertising: `${CDN}/1561500786311-T16DW37D78EVDWAU2ZF1/image-asset.png`,
  social: `${CDN}/1561500796618-XC44NW4HDA715LFNU7L4/image-asset.png`,
  nav: `${CDN}/1561500814288-G1FI1PP842KR8SDFW63V/image-asset.png`,
  training: `${CDN}/1561500824058-6VVREQ99KMPIUY3LHHE4/image-asset.png`,
  keyboard1: `${CDN}/31da27ce-fe25-4908-a52c-b160163e4057/Screenshot+2021-06-24+172827.png`,
  keyboard2: `${CDN}/f8ac62df-f2b6-44af-8691-aa5001ce7f57/Screenshot+2021-06-24+172913.png`,
  /** Lab overview — Fiat + surround projection + monitoring desks */
  simLab: '/media/ar-vr/car-sim-lab.jpg',
  /** 360 Car Simulator stills */
  simCabin: `${CDN}/430343be-366c-4d4d-a1e3-86adcc9df89b/IMG_6391.JPG`,
  simWheel: `${CDN}/44c4dcbb-d889-4683-b45f-eb7f30e6fadb/Screenshot+2026-04-22+at+1.18.51%E2%80%AFPM.png`,
  simHud: `${CDN}/c4779d75-08dc-4a4a-ab73-c87992fe7e39/IMG_6406.JPG`,
  simDeer: `${CDN}/98dc050a-7f9d-42fe-a16d-e5566a74ff5f/IMG_6424.JPG`,
}

const videos = {
  /** MagicLeapResearch/mf1.mov ↔ Squarespace fc67e835… (~8.8s) */
  annotator: {
    src: '/media/ar-vr/annotator-mode.mp4',
    poster: '/media/ar-vr/annotator-mode-poster.jpg',
  },
  /** MagicLeapResearch/mf2.mov ↔ Squarespace 93fd602d… (~8.9s) */
  latestChannel: {
    src: '/media/ar-vr/latest-channel.mp4',
    poster: '/media/ar-vr/latest-channel-poster.jpg',
  },
  /** MagicLeapResearch/mf3.mov ↔ Squarespace 27f0227b… (~13.7s) */
  channelSelection1: {
    src: '/media/ar-vr/channel-selection-1.mp4',
    poster: '/media/ar-vr/channel-selection-1-poster.jpg',
  },
  /** MagicLeapResearch/mf123.mov ↔ Squarespace 30179885… (~107s) */
  channelSelection2: {
    src: '/media/ar-vr/channel-selection-2.mp4',
    poster: '/media/ar-vr/channel-selection-2-poster.jpg',
  },
  /** Other Unity Work/2021-06-24… ↔ Squarespace a3ec6c22… (~101.5s) */
  vrKeyboard: {
    src: '/media/ar-vr/vr-keyboard.mp4',
    poster: '/media/ar-vr/vr-keyboard-poster.jpg',
  },
  /** Career 2025/AR VR projects/spaceinvaders.MP4 ↔ Squarespace cfea78b2… (~112.8s) */
  spaceInvader1: {
    src: '/media/ar-vr/space-invader-1.mp4',
    poster: '/media/ar-vr/space-invader-1-poster.jpg',
  },
  /** backup/CT-2018Fall/ARVR/movie1.mp4 ↔ Squarespace 06320c8f… (~153.8s) */
  makerSpace: {
    src: '/media/ar-vr/vr-maker-space.mp4',
    poster: '/media/ar-vr/vr-maker-space-poster.jpg',
  },
  /** CapCut car simulator.mov ↔ Squarespace 4d7233c1… (~12.7s) */
  carSimulator: {
    src: '/media/ar-vr/car-simulator.mp4',
    poster: '/media/ar-vr/car-simulator-poster.jpg',
  },
}

export function ArVrPage() {
  return (
    <CaseStudyLayout
      brand="AR/VR"
      title="AR/VR Design"
      toc={toc}
      heroImage={img.hero}
      lede="A collection of AR, VR, and spatial interaction work — from Magic Leap to mobile AR."
    >
      <section id="intro-page" className="section">
        <p className="section__label">AR/VR Design</p>
        <p>
          Here is the collection of what I’ve worked on in AR, VR, ranging from
          mobile, HMD, to projections. Recent years my work at Unity focused more
          in the 3D tooling space and I decided to use this page as a
          self-record, not one that is polished for a public design portfolio
          page. Feel free to dig around, there is still a lot of interesting
          ideas that I wished I could have more time and proper resource to work
          on.
        </p>
      </section>

      <section id="vr-keyboard" className="section">
        <p className="section__label">VR Keyboard Design</p>
        <div className="copy-media">
          <div className="copy-media__copy">
            <p>
              This is an experiment of testing out and figuring out what I
              considered the most comfortable keyboard input at the time.
              Researching a range of commont techniques of keyboard in VR space
              and a set of layout and input ways such as the drumsticks, the
              finger taps, the physical keyboard. Prototyped in Unity,
              multi-person available (Just the not left by the keyboard is
              visible by others).
            </p>
          </div>
          <div className="copy-media__media">
            <CaseStudyVideo
              src={videos.vrKeyboard.src}
              poster={videos.vrKeyboard.poster}
              label="VR Keyboard Design demo"
            />
          </div>
        </div>
        <div className="media-cluster media-cluster--2">
          <Figure src={img.keyboard1} alt="VR keyboard" />
          <Figure src={img.keyboard2} alt="VR keyboard" />
        </div>
      </section>

      <section id="space-invader" className="section">
        <p className="section__label">Mobile AR Space Invader</p>
        <div className="copy-media">
          <div className="copy-media__copy">
            <p>
              A good old Space Invaders game in the mobile AR space, multi-player
              allowed, shoot not only aliens but other players. Mobile AR,
              multi-person. Prototyped on iPad Pro and Unity.
            </p>
            <p>
              The original thoughts was to get the space invader working on
              random real world maps, but the proton and mapbox setup didn’t work
              out well. This is just the testing of the worldmap for multiplayer
              mode.
            </p>
          </div>
          <div className="copy-media__media">
            <CaseStudyVideo
              src={videos.spaceInvader1.src}
              poster={videos.spaceInvader1.poster}
              label="Mobile AR Space Invader — gameplay"
            />
          </div>
        </div>
      </section>

      <section id="makerspace" className="section">
        <p className="section__label">VR Maker Space</p>
        <div className="copy-media">
          <div className="copy-media__copy">
            <p>
              Imagining a VR Makerspace, where users interact with all sort of
              interaction techniques in VR, and with live-data pulling from the
              realworld. Prototyped in HTC Vive, Unity, single person VR HMD
              setup.
            </p>
          </div>
          <div className="copy-media__media">
            <CaseStudyVideo
              src={videos.makerSpace.src}
              poster={videos.makerSpace.poster}
              label="VR Maker Space demo"
            />
          </div>
        </div>
      </section>

      <section id="simulator" className="section">
        <p className="section__label">360 Car Simulator</p>
        <div className="copy-media copy-media--top">
          <div className="copy-media__copy">
            <p>
              The driving simulator was setup for autonomous driving simulations,
              we are able to drive remotely from the external steering or to set
              up preprogrammed route to mimic the self-driving scenario for user
              testing. I help set up and work with the car simulator mainly for a
              research on Feedforward Audio icons in Self Driving Cars. Which
              means we set up a set of scenarios with designed sonification for
              each scene, and see how the passengers in the car perceives those
              sounds to create trust and less intrusive awareness between vehicle
              and passengers. Unfortunately, most recordings during the actual
              research were not available to share at this moment. 3D experience
              prototyped in Unity and Land Rover open sourced driving simulator
              (which they mapped the San Francisco roads in 3D).
            </p>
          </div>
          <div className="copy-media__media">
            <CaseStudyVideo
              src={videos.carSimulator.src}
              poster={videos.carSimulator.poster}
              label="360 Car Simulator"
            />
          </div>
        </div>
        <div className="media-cluster media-cluster--mosaic">
          <Figure
            src={img.simLab}
            alt="360 Car Simulator — lab with surround projection and monitoring stations"
          />
          <Figure
            src={img.simCabin}
            alt="360 Car Simulator — cabin with surround projection"
          />
          <Figure
            src={img.simWheel}
            alt="360 Car Simulator — steering wheel and instrument display"
          />
          <Figure
            src={img.simHud}
            alt="360 Car Simulator — HUD driving view"
          />
          <Figure
            src={img.simDeer}
            alt="360 Car Simulator — scenario with deer on the road"
          />
        </div>
      </section>
      <section id="annotate" className="section section--last">
        <p className="section__label">Annotate All!</p>
        <p className="section__kicker">
          A Perspective Preserved Annotation System for Asynchronous
          Collaboration based on Head Mounted Display Augmented Reality
        </p>
        <p>
          <strong>Keywords</strong> AR · Spatial interaction design · Magic Leap
          One
          <br />
          <strong>Solo Project</strong> · Role: Interaction Designer and developer
          <br />
          <strong>Tool</strong> Magic Leap SDK · Unity · Sketch
          <br />
          <strong>Date</strong> Jan 2019 - June 2019
        </p>
        <p>
          “Annotate all!” is an interaction design research project done at the
          Cornell Tech Connected Experience Lab- Mixed Reality Group lead by
          Serge B. and Harald H.. A spatial annotation system is designed and
          built with Magic Leap One(an augmented reality headset) allowing
          asynchronous annotation. We are excited to explore a potential way of
          how human could interact with the real world with Head-mounted AR
          display. The project was accepted to the CV4AR/VR workshop at one of
          the most important computer vision conference - CVPR
        </p>
        <Figure
          src={img.poster}
          alt="CVPR poster"
          caption="Download CVPR poster in PDF to get a overview of the project"
        />
        <p>
          <a
            href="/media/ar-vr/cvpr-poster.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Download CVPR poster (PDF)
          </a>
          {' · '}
          <a
            href="https://www.pytseng.com/s/Annotate_all__A_Perspective_Preserved_Asynchronous__Annotation_System_for_Collaborative_Augmented_Re-hd7g.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Link to Research Paper
          </a>
        </p>

        <h3>Augmented Reality</h3>
        <ul>
          <li>It superimposes virtual content over the real-world environment.</li>
          <li>
            It is interactive, cameras are commonly used to gather information
            about the surroundings of the user and the data become digitally
            manipulatable by computer vision.
          </li>
          <li>It is registered in three dimensions.</li>
        </ul>
        <div className="media-cluster media-cluster--mosaic">
          <Figure src={img.ml1} alt="AR headset explanation" />
          <Figure src={img.photo1} alt="Magic Leap session" />
          <Figure src={img.photo2} alt="Magic Leap session" />
        </div>

        <h3>Core Questions</h3>
        <p>
          Before jump in to the system, four questions need to be answer to form
          a clearer picture of why you should care.
        </p>
        <p>
          <strong>Why annotation?</strong> Annotation is a fundamental technique
          for sharing information. We leave notes, illustrations, signs to guide
          others through an intricate sequence of information such as operating a
          machine or familiarizing a new environment. It is the essential way to
          meaningful content creation which is the fundamental of the success of
          a new media.
        </p>
        <p>
          <strong>Why asynchronous?</strong> Asynchronous interaction allows us
          to share information across timespan and it makes meaningful
          interaction scalable. It is so common to see asynchronous annotation in
          mixed reality games and professional training softwares.
        </p>
        <p>
          <strong>Why preserve perspective?</strong> In annotations, angle of
          vision information help foster clearer communication. For example, a
          technician might be looking at the indicator light above the valve that
          he is operating. If we were on the side of the technician, we would
          naturally follow the angle of view of this technician and learn that
          the indicator light is related to the valve. On the other hand, if this
          kind of interaction is recorded without preserving the technician’s
          perspective, it is difficult for viewers to link those details
          together.
        </p>
        <p>
          <strong>Why now?</strong> Developer-ready headsets armed with powerful
          sensors are becoming more accessible than ever, i. Magic Leap One and
          Microsoft Hololens. In the past, we annotate physically in real world,
          digitally in virtual world. We learn to interact with digital
          information by haptic input such as keyboard, mouse clicks, and touches
          on devices. Then there was the rise of voice interface smart home
          products that requires less learning, we simply need to speak to
          perform tasks. Although none of the above is perfectly intuitive, we
          see a trend of us human want to interact “naturally.” Now, we are grant
          with these headsets to explore new ways to interact with the world. By
          combining our gestures, voices, views, and other inputs sources, we are
          able to see virtual content overlaying on to the real world
          immersively, and we could use either barehands or controller to
          interact with digital content intuitively. It opens up new ways of
          interaction design possibilities.
        </p>
        <blockquote>
          “This is so cool! I was like watching Andrew’s (friend of Tim) ghost
          teaching me how to read this poster board right in my view! And I could
          watch it at any angle!?”
          <cite>— Tim - CVPR attendant</cite>
        </blockquote>

        <h3>System overview</h3>
        <div className="copy-media copy-media--top">
          <div className="copy-media__copy">
            <p>
              Here’s an example, a laboratory need to train a new research
              assistant everyday for an entire year? You attach some sticky notes
              on the arm and record a instruction video? Nope, you use are
              system! Instructor creates annotations and record voice with the AR
              headset right on the robot arm, and then the research assistants
              wear the headset to view the instructions asynchronously. Problem
              solved!
            </p>
          </div>
          <div className="copy-media__media">
            <Figure src={img.overview} alt="System overview" />
          </div>
        </div>

        <h3>Modes</h3>
        <div className="copy-media copy-media--top">
          <div className="copy-media__copy">
            <p>
              <strong>Annotator Mode</strong> — Annotator’s headpose, fixation
              points, voice, hand trailings are recorded. background music are
              added to each mode so that users could easily differentiate which
              mode they are in.The light sphere is the annotation mark, once
              activated, we begin to track the controller position.
            </p>
          </div>
          <div className="copy-media__media">
            <div className="media-cluster media-cluster--2">
              <Figure src={img.annotator} alt="Annotator mode" />
              <CaseStudyVideo
                src={videos.annotator.src}
                poster={videos.annotator.poster}
                label="Annotator Mode"
              />
            </div>
          </div>
        </div>
        <div className="media-frame">
          <iframe
            title="Annotate All demo"
            src="https://www.youtube.com/embed/rxFTt-EOiOg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="copy-media copy-media--top">
          <div className="copy-media__copy">
            <p>
              <strong>Latest Channel Mode</strong> — To reconstruct the angle of
              view of the annotator, we use Fixation point, Controller position,
              Headpose. The pinkish sphere is the one being replay. And the rest
              of the light spheres are existing annotation marks
            </p>
            <p>
              <strong>Channel Selection Mode</strong> — Viewers are able to select
              specific annotations to review playback with raycasting.
            </p>
          </div>
          <div className="copy-media__media">
            <div className="media-cluster media-cluster--videos">
              <CaseStudyVideo
                src={videos.latestChannel.src}
                poster={videos.latestChannel.poster}
                label="Latest Channel Mode"
              />
              <CaseStudyVideo
                src={videos.channelSelection1.src}
                poster={videos.channelSelection1.poster}
                label="Channel Selection Mode — clip 1"
              />
            </div>
          </div>
        </div>
        <CaseStudyVideo
          src={videos.channelSelection2.src}
          poster={videos.channelSelection2.poster}
          label="Channel Selection Mode — extended walkthrough"
        />

        <h3>Conclusion</h3>
        <p>
          My work demonstrates a virtual annotation method for asynchronously
          sharing information about the real world.the annotation system
          represents a step forward in allowing non-technical users to create
          visual and audio annotations without prior training. Viewers can easily
          review the recorded drawings, head poses, and ﬁxation points by
          operating the simple playback control of each annotation mark.
          Furthermore, viewers can move freely in the real-world space to view
          the recorded annotations in different angle. We see our work as a
          stepping stone toward more complicated content creating tools in the
          mixed reality space. Some use cases are:
        </p>
        <div className="media-cluster media-cluster--usecases">
          <Figure src={img.advertising} alt="Advertising" caption="Advertising" />
          <Figure src={img.social} alt="3D Social Media" caption="3D Social Media" />
          <Figure src={img.nav} alt="Spatial Navigation" caption="Spatial Navigation" />
          <Figure
            src={img.training}
            alt="Professional Training"
            caption="Professional Training"
          />
        </div>
        <p>
          Further study may include user testing on how effective this system is
          compare over existing non-mixed reality, mobile AR, or VR annotation
          system. In addition, detail interface design could be improved to
          create a more intuitive annotation experience.
        </p>
      </section>

    </CaseStudyLayout>
  )
}
